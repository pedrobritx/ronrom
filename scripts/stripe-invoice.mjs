import { createHash } from 'node:crypto';
import { extraPrices, plans } from '../src/pricing.ts';

export function prepareInvoice(booking) {
  if (!booking || typeof booking !== 'object' || Array.isArray(booking)) {
    throw new Error('O arquivo precisa conter os dados de uma reserva.');
  }
  const { id, stripeCustomerId, paymentMethod, timing, status, daysUntilDue } = booking;
  if (typeof id !== 'string' || !/^[A-Za-z0-9_-]{1,80}$/.test(id)) {
    throw new Error('Informe o ID estável da reserva em id.');
  }
  if (typeof stripeCustomerId !== 'string' || !/^cus_[A-Za-z0-9]+$/.test(stripeCustomerId)) {
    throw new Error('Informe o ID Stripe do cliente de teste em stripeCustomerId.');
  }
  if (paymentMethod !== 'stripe') {
    throw new Error('O Pix direto vai para o Nubank da Lela. Registre a baixa após conferir o crédito.');
  }
  if (!['advance', 'after'].includes(timing)) {
    throw new Error('Selecione advance ou after em timing.');
  }
  const requiredStatus = timing === 'advance' ? 'confirmed' : 'completed';
  if (status !== requiredStatus) {
    throw new Error('A reserva ainda precisa estar em ' + requiredStatus + ' para preparar a cobrança.');
  }
  if (!Number.isInteger(daysUntilDue) || daysUntilDue < 0 || daysUntilDue > 365) {
    throw new Error('Informe o prazo combinado em daysUntilDue, de 0 a 365 dias.');
  }

  const services = timing === 'advance' ? booking.approved : booking.performed;
  const plan = plans.find((entry) => entry.id === services?.plan);
  if (!plan) {
    throw new Error('Informe o plano e os serviços aprovados ou prestados para esta reserva.');
  }
  const { visits, cats, medicationCatVisits, nailTrimCatSessions, treatVisits, multiCatSupplementCents } = services;
  const counts = [visits, cats, medicationCatVisits, nailTrimCatSessions, treatVisits];
  if (!counts.every((value) => Number.isInteger(value) && value >= 0 && value <= 999)
      || visits === 0 || cats === 0 || medicationCatVisits > cats * visits || treatVisits > visits) {
    throw new Error('Confira as quantidades de visitas, gatos e adicionais.');
  }
  if (plan.id === 'premium' && treatVisits > 0) {
    throw new Error('O mimo padrão já está incluído no plano Dengo Premium.');
  }
  if (cats > 1 && (!Number.isInteger(multiCatSupplementCents) || multiCatSupplementCents < 0
      || multiCatSupplementCents > 99_999_999)) {
    throw new Error('Informe em centavos o adicional acertado para múltiplos gatos, inclusive se for zero.');
  }
  if (cats === 1 && multiCatSupplementCents) {
    throw new Error('O adicional para múltiplos gatos só se aplica a reservas com mais de um gato.');
  }

  const lines = [
    { id: 'visits', description: plan.label + ' · visitas', quantity: visits, unitCents: plan.price * 100 },
    { id: 'medication', description: 'Medicação simples · gato por visita', quantity: medicationCatVisits, unitCents: extraPrices.medication * 100 },
    { id: 'nails', description: 'Corte de unhas · gato por sessão', quantity: nailTrimCatSessions, unitCents: extraPrices.nails * 100 },
    { id: 'treat', description: 'Mimo especial · por visita', quantity: treatVisits, unitCents: extraPrices.treat * 100 },
    { id: 'multi_cat', description: 'Adicional combinado para múltiplos gatos', quantity: 1, unitCents: multiCatSupplementCents ?? 0 },
  ].filter(({ quantity, unitCents }) => quantity > 0 && unitCents > 0)
    .map(({ id, description, quantity, unitCents }) => ({
      id,
      description: description + ' (×' + quantity + ')',
      amount: quantity * unitCents,
    }));
  const total = lines.reduce((sum, line) => sum + line.amount, 0);
  if (total > 99_999_999) {
    throw new Error('O total ultrapassa o limite de oito dígitos em centavos.');
  }
  return { id, stripeCustomerId, daysUntilDue, timing, total, currency: 'brl', lines };
}

export async function saveDraft(stripe, accountId, invoiceData) {
  if (!/^acct_[A-Za-z0-9]+$/.test(accountId ?? '')) {
    throw new Error('Preencha STRIPE_ACCOUNT_ID com o ID da conta Ronrom em Casa.');
  }
  const account = await stripe.accounts.retrieveCurrent();
  if (account.id !== accountId || account.country !== 'BR') {
    throw new Error('A chave não pertence à conta brasileira indicada em STRIPE_ACCOUNT_ID.');
  }

  const { id, stripeCustomerId, daysUntilDue, currency, lines, total } = invoiceData;
  const fingerprint = createHash('sha256').update(JSON.stringify(invoiceData)).digest('hex');
  let invoice;
  for await (const candidate of stripe.invoices.list({ limit: 100 })) {
    if (candidate.metadata?.ronrom_booking_id !== id) continue;
    if (invoice) throw new Error('Há mais de uma fatura vinculada à reserva. Confira no painel.');
    invoice = candidate;
  }
  if (!invoice) {
    invoice = await stripe.invoices.create({
      customer: stripeCustomerId,
      currency,
      collection_method: 'send_invoice',
      days_until_due: daysUntilDue,
      auto_advance: false,
      pending_invoice_items_behavior: 'exclude',
      automatic_tax: { enabled: false },
      metadata: { ronrom_booking_id: id, ronrom_snapshot: fingerprint },
    }, { idempotencyKey: 'ronrom:invoice:' + id });
  }

  if (invoice.livemode !== false || invoice.status !== 'draft' || invoice.auto_advance !== false
      || invoice.customer !== stripeCustomerId || invoice.currency !== currency
      || invoice.metadata?.ronrom_snapshot !== fingerprint) {
    throw new Error('A fatura existente ou a reserva mudou. Confira a cobrança no painel antes de prosseguir.');
  }
  const existing = await stripe.invoices.listLineItems(invoice.id, { limit: 10 });
  if (existing.data.length === 0) {
    await stripe.invoices.addLines(invoice.id, {
      lines: lines.map((line) => ({
        amount: line.amount,
        description: line.description,
        discountable: false,
        metadata: { ronrom_service: line.id },
      })),
    }, { idempotencyKey: 'ronrom:lines:' + invoice.id });
  }
  const saved = await stripe.invoices.retrieve(invoice.id);
  const matches = !saved.lines.has_more && saved.lines.data.length === lines.length
    && lines.every((line) => saved.lines.data.some((item) =>
      item.metadata.ronrom_service === line.id && item.amount === line.amount && item.description === line.description));
  if (!matches || saved.total !== total || saved.status !== 'draft' || saved.auto_advance !== false) {
    throw new Error('Confira as linhas e o total da fatura ' + invoice.id + ' no painel.');
  }
  return { id: saved.id, status: saved.status, total, currency };
}

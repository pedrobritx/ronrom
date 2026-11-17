import { readFile } from 'node:fs/promises';
import Stripe from 'stripe';
import { prepareInvoice, saveDraft } from './stripe-invoice.mjs';

try {
  const [file, flag, ...extra] = process.argv.slice(2);
  if (!file || (flag && flag !== '--write') || extra.length) {
    throw new Error('Uso: npm run stripe:draft -- <reserva.json> [--write]');
  }
  const invoice = prepareInvoice(JSON.parse(await readFile(file, 'utf8')));
  if (!flag) {
    console.log(JSON.stringify(invoice, null, 2));
  } else {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!/^(sk|rk)_test_[A-Za-z0-9]+$/.test(key ?? '')) {
      throw new Error('Preencha STRIPE_SECRET_KEY com uma chave de teste da Ronrom em Casa.');
    }
    const stripe = new Stripe(key, { maxNetworkRetries: 2, timeout: 15_000 });
    const draft = await saveDraft(stripe, process.env.STRIPE_ACCOUNT_ID, invoice);
    console.log(JSON.stringify(draft, null, 2));
  }
} catch (error) {
  if (error instanceof Stripe.errors.StripeError) {
    console.error('Falha na Stripe (' + (error.code ?? error.type) + '). Consulte os logs no painel de teste.', error.requestId ?? '');
  } else {
    console.error(error instanceof SyntaxError ? 'O arquivo precisa conter JSON válido.' : error.message);
  }
  process.exitCode = 1;
}

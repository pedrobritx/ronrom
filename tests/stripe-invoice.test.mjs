import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareInvoice, saveDraft } from '../scripts/stripe-invoice.mjs';

const services = { plan: 'companhia', visits: 2, cats: 1, medicationCatVisits: 2, nailTrimCatSessions: 1, treatVisits: 2 };
const booking = {
  id: 'reservation-42',
  stripeCustomerId: 'cus_Test',
  paymentMethod: 'stripe',
  timing: 'advance',
  status: 'confirmed',
  daysUntilDue: 3,
  approved: services,
};

test('antecipado cobra o orçamento aprovado e pós-pago cobra os serviços prestados', () => {
  assert.equal(prepareInvoice(booking).total, 17100);
  const postpaid = {
    ...booking, timing: 'after', status: 'completed',
    performed: { ...services, visits: 1, medicationCatVisits: 1, treatVisits: 0 },
  };
  assert.equal(prepareInvoice(postpaid).total, 8500);
  assert.throws(() => prepareInvoice({ ...postpaid, status: 'confirmed' }), /completed/);
  assert.throws(() => prepareInvoice({ ...booking, paymentMethod: 'pix' }), /Nubank/);
  assert.throws(() => prepareInvoice({ ...booking, approved: { ...services, cats: 2 } }), /múltiplos gatos/);
  assert.throws(() => prepareInvoice({ ...booking, approved: { ...services, plan: 'premium' } }), /já está incluído/);
});

test('recusa conta incorreta, retoma rascunho vazio e reaproveita a fatura completa', async () => {
  let invoice;
  let lines = [];
  let addCalls = 0;
  const stripe = {
    accounts: { retrieveCurrent: async () => ({ id: 'acct_Ronrom', country: 'BR' }) },
    invoices: {
      async *list() { if (invoice) yield invoice; },
      async create(params, { idempotencyKey }) {
        assert.equal(invoice, undefined);
        assert.equal(params.auto_advance, false);
        assert.equal(params.collection_method, 'send_invoice');
        assert.equal(params.pending_invoice_items_behavior, 'exclude');
        assert.equal(idempotencyKey, 'ronrom:invoice:reservation-42');
        invoice = { ...params, id: 'in_Example', status: 'draft', livemode: false };
        return invoice;
      },
      async listLineItems() { return { data: lines }; },
      async addLines(id, params, { idempotencyKey }) {
        assert.equal(idempotencyKey, 'ronrom:lines:' + id);
        addCalls += 1;
        if (addCalls === 1) throw new Error('interrupção antes de salvar as linhas');
        lines = params.lines;
      },
      async retrieve() {
        return { ...invoice, lines: { data: lines, has_more: false }, total: lines.reduce((sum, line) => sum + line.amount, 0) };
      },
    },
  };
  const data = prepareInvoice(booking);
  await assert.rejects(saveDraft(stripe, 'acct_Outra', data), /não pertence/);
  assert.equal(invoice, undefined);
  await assert.rejects(saveDraft(stripe, 'acct_Ronrom', data), /interrupção/);
  assert.deepEqual(await saveDraft(stripe, 'acct_Ronrom', data), {
    id: 'in_Example', status: 'draft', total: 17100, currency: 'brl',
  });
  assert.equal((await saveDraft(stripe, 'acct_Ronrom', data)).id, 'in_Example');
  assert.equal(addCalls, 2);
  await assert.rejects(saveDraft(stripe, 'acct_Ronrom', { ...data, daysUntilDue: 5 }), /mudou/);
});

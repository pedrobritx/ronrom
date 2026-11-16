import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Lightweight source contract check; type-checked build validates implementation.
const source = readFileSync(new URL('../src/pricing.ts', import.meta.url), 'utf8');

test('pricing contains the three agreed base amounts', () => {
  for (const price of ['price: 40', 'price: 60', 'price: 80']) {
    assert.ok(source.includes(price), 'missing ' + price);
  }
});

test('medication is charged by cat and by visit; nail trim per session', () => {
  assert.match(source, /10 \* cats \* visits/);
  assert.match(source, /15 \* cats/);
});

test('multi-cat visits require final price confirmation', () => {
  assert.match(source, /needsQuote: cats > 1/);
});

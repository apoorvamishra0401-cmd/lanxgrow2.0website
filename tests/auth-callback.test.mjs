import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const source = fs.readFileSync(new URL('../src/auth/callback.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const { exchangeCallback, createCallbackCompleter } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
function fixture({ recovery = false, exchangeError = false, userError = false } = {}) {
  let listener, exchanges = 0, lookups = 0, unsubscribed = false;
  const client = { auth: {
    onAuthStateChange: fn => { listener = fn; return { data: { subscription: { unsubscribe() { unsubscribed = true; } } } }; },
    async exchangeCodeForSession() { exchanges++; if (recovery) listener('PASSWORD_RECOVERY'); return { data: { session: {}, user: { id: 'fixture' } }, error: exchangeError ? Error('invalid') : null }; },
    async setSession() { return { data: { session: {} }, error: null }; },
    async getUser() { lookups++; return { data: { user: userError ? null : { id: 'fixture' } }, error: userError ? Error('revoked') : null }; },
  } };
  return { client, stats: () => ({ exchanges, lookups, unsubscribed }) };
}
test('OAuth routes to current policy consent', async () => {
  const f = fixture(); assert.equal(await exchangeCallback(f.client, 'https://app.example/auth-callback?code=test'), '/consent'); assert.equal(f.stats().unsubscribed, true);
});
test('recovery is determined by SDK event, not an untrusted query flag', async () => {
  const f = fixture({ recovery: true }); assert.equal(await exchangeCallback(f.client, 'https://app.example/auth-callback?code=test'), '/reset-password');
  assert.equal(await exchangeCallback(fixture().client, 'https://app.example/auth-callback?code=test&type=recovery'), '/consent');
});
test('StrictMode shares a single one-time exchange', async () => {
  const f = fixture(); const complete = createCallbackCompleter(); const href = 'https://app.example/auth-callback?code=test';
  const [a, b] = await Promise.all([complete(f.client, href), complete(f.client, href)]); assert.equal(a, b); assert.equal(f.stats().exchanges, 1);
});
test('failed exchange never falls back to an existing session', async () => {
  const f = fixture({ exchangeError: true }); await assert.rejects(exchangeCallback(f.client, 'https://app.example/auth-callback?code=expired')); assert.equal(f.stats().lookups, 0); assert.equal(f.stats().unsubscribed, true);
});
test('empty callback and provider errors reject before user lookup', async () => {
  for (const suffix of ['', '?error=access_denied', '#error=expired', '?access_token=x&refresh_token=y&type=recovery']) {
    const f = fixture(); await assert.rejects(exchangeCallback(f.client, `https://app.example/auth-callback${suffix}`)); assert.equal(f.stats().lookups, 0);
  }
});
test('revoked server identity cannot complete a valid exchange', async () => {
  await assert.rejects(exchangeCallback(fixture({ userError: true }).client, 'https://app.example/auth-callback?code=test'));
});
test('legacy implicit recovery verifies session and server identity', async () => {
  const f = fixture(); assert.equal(await exchangeCallback(f.client, 'https://app.example/reset-password#access_token=test&refresh_token=test&type=recovery'), '/reset-password'); assert.equal(f.stats().lookups, 1);
});

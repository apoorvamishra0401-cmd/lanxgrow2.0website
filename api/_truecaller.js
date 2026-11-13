import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

export const STATE_COOKIE = '__Host-lanx_truecaller_state';
export const TTL_SECONDS = 180;
const ID_PATTERN = /^[A-Za-z0-9_-]{32}$/;
const hash = value => createHash('sha256').update(value).digest('hex');
export const newToken = (bytes = 24) => randomBytes(bytes).toString('base64url');
export const validId = id => typeof id === 'string' && ID_PATTERN.test(id);
export const keyFor = id => 'lanx:tc:web:v1:' + id;

export async function redis(command) {
  const base = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!base || !token || !base.startsWith('https://')) throw Error('Truecaller test Redis is not configured');
  const response = await fetch(base, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
    cache: 'no-store',
    signal: AbortSignal.timeout(4000)
  });
  if (!response.ok) throw Error('Temporary verification storage unavailable');
  const body = await response.json();
  if (body.error) throw Error('Temporary verification storage unavailable');
  return body.result;
}
export async function readTicket(id) {
  if (!validId(id)) return null;
  const raw = await redis(['GET', keyFor(id)]);
  return raw ? JSON.parse(raw) : null;
}
export async function writeTicket(id, value) {
  await redis(['SET', keyFor(id), JSON.stringify(value), 'EX', TTL_SECONDS]);
}
export async function deleteTicket(id) {
  await redis(['DEL', keyFor(id)]);
}
export const challengeHash = hash;
export function stateCookie(value, age = TTL_SECONDS) {
  return STATE_COOKIE + '=' + value + '; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=' + age;
}
export function authorizedPoll(req, id, record) {
  if (!record || !validId(id)) return false;
  const cookie = (req.headers.cookie || '').split(';').map(v => v.trim())
    .find(v => v.startsWith(STATE_COOKIE + '='));
  if (!cookie) return false;
  const value = cookie.slice(STATE_COOKIE.length + 1);
  const [cookieId, secret, extra] = value.split('.');
  if (extra !== undefined || cookieId !== id || !/^[A-Za-z0-9_-]{43}$/.test(secret || '')) return false;
  const provided = Buffer.from(hash(secret), 'hex');
  const expected = Buffer.from(record.challengeHash || '', 'hex');
  return expected.length === 32 && timingSafeEqual(provided, expected);
}
export function verifiedEndpoint(candidate) {
  try {
    const url = new URL(candidate);
    if (url.protocol !== 'https:' || url.port || url.username || url.password ||
        !/^profile4(?:-[a-z0-9]+)?\.truecaller\.com$/i.test(url.hostname) ||
        url.pathname !== '/v1/default' || url.search || url.hash) return null;
    return url.toString();
  } catch { return null; }
}
export function send(res, code, data) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  return res.status(code).json(data);
}

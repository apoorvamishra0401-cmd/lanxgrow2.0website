import {
  validId, authorizedPoll, readTicket, deleteTicket, send, stateCookie
} from './_truecaller.js';

function extractProfile(body) {
  const item = Array.isArray(body.phoneNumbers) ? body.phoneNumbers[0] : null;
  const raw = String(item?.phoneNumber || body.phone || '').replace(/[\s()-]/g, '');
  const dialing = String(item?.dialingCode || '').replace(/\D/g, '');
  const phone = raw.startsWith('+') ? raw : (dialing ? '+' + dialing + raw : '');
  if (!/^\+[1-9]\d{7,14}$/.test(phone)) throw Error('No verified phone number in provider profile');
  return {
    phone,
    name: [body.firstName, body.lastName].filter(v => typeof v === 'string').join(' ').slice(0, 160)
  };
}
export default async function handler(req, res) {
  if (req.method !== 'GET') return send(res, 405, { error: 'Method not allowed' });
  const id = typeof req.query?.requestId === 'string' ? req.query.requestId : '';
  if (!validId(id)) return send(res, 400, { error: 'Invalid request ID' });
  try {
    const record = await readTicket(id);
    if (!authorizedPoll(req, id, record)) return send(res, 403, { error: 'Verification session not found' });
    if (record.status === 'pending') return send(res, 200, { status: 'pending' });
    if (record.status === 'rejected') {
      await deleteTicket(id);
      res.setHeader('Set-Cookie', stateCookie('', 0));
      return send(res, 200, { status: 'rejected' });
    }
    if (record.status !== 'received' || !record.accessToken || !record.profileUrl) {
      return send(res, 503, { error: 'Invalid verification state' });
    }
    const response = await fetch(record.profileUrl, {
      headers: { Authorization: 'Bearer ' + record.accessToken, 'Cache-Control': 'no-cache' },
      redirect: 'error',
      signal: AbortSignal.timeout(5000),
      cache: 'no-store'
    });
    if (!response.ok) throw Error('Truecaller rejected the profile token');
    const profile = extractProfile(await response.json());
    await deleteTicket(id); // access token and correlation state are single-use
    res.setHeader('Set-Cookie', stateCookie('', 0));
    // IMPORTANT: A verified profile is NOT a LanXgrow session.
    // The app's existing auth backend must link the verified identity and
    // issue a real account session before navigating to any protected dashboard.
    return send(res, 200, { status: 'verified', profile, sessionEstablished: false });
  } catch {
    return send(res, 503, { error: 'Unable to finish verification. Please retry securely.' });
  }
}

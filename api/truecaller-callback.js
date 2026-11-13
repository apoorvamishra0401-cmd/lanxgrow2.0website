import { validId, verifiedEndpoint, readTicket, writeTicket, send } from './_truecaller.js';

// Public server-to-server Truecaller callback. No browser session is established here.
export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });
  const body = typeof req.body === 'object' && req.body !== null ? req.body : {};
  const { requestId, accessToken, endpoint, status } = body;
  if (!validId(requestId)) return send(res, 400, { error: 'Invalid request ID' });
  try {
    const ticket = await readTicket(requestId);
    if (!ticket) return send(res, 200, { accepted: true }); // expired/unknown: no identity granted
    if (status === 'flow_invoked') return send(res, 200, { accepted: true });
    if (status === 'user_rejected') {
      await writeTicket(requestId, { ...ticket, status: 'rejected' });
      return send(res, 200, { accepted: true });
    }
    const profileUrl = verifiedEndpoint(endpoint);
    if (!profileUrl || typeof accessToken !== 'string' || accessToken.length < 16 || accessToken.length > 4096) {
      return send(res, 400, { error: 'Invalid verification response' });
    }
    if (ticket.status === 'pending') {
      // Store token only server-side; status route uses it once to query Truecaller.
      // Avoid fetching profile here: Truecaller expects the callback to respond quickly.
      await writeTicket(requestId, { ...ticket, status: 'received', accessToken, profileUrl });
    }
    return send(res, 200, { accepted: true });
  } catch {
    return send(res, 503, { error: 'Callback storage unavailable' });
  }
}

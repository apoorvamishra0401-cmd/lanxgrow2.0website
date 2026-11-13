import { newToken, challengeHash, stateCookie, writeTicket, send } from './_truecaller.js';

// Called only when the user clicks "Continue with Truecaller".
export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });
  const origin = req.headers.origin;
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  if (!origin || !host || origin !== 'https://' + host) {
    return send(res, 403, { error: 'Same-origin request required' });
  }
  try {
    const requestId = newToken(24);
    const secret = newToken(32);
    await writeTicket(requestId, {
      status: 'pending', challengeHash: challengeHash(secret), createdAt: Date.now()
    });
    res.setHeader('Set-Cookie', stateCookie(requestId + '.' + secret));
    return send(res, 200, { requestId, expiresIn: 180 });
  } catch {
    return send(res, 503, { error: 'Verification temporarily unavailable' });
  }
}

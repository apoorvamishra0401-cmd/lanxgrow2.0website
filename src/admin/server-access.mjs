/** LANX-04 development-only server authorization contract. NOT a deployed API. */
const features = Object.freeze({
  student: new Set(['ai-soul','speaking-practice','listening-practice','reading-practice','writing-practice','practice-exercises','progress-reports','video-practice']),
  fresher: new Set(['ai-soul','speaking-practice','listening-practice','reading-practice','writing-practice','practice-exercises','progress-reports','interview-preparation','interview-video','interview-assessment']),
  professional: new Set(['ai-soul','speaking-practice','listening-practice','reading-practice','writing-practice','practice-exercises','progress-reports','interview-preparation','interview-video','interview-assessment']),
});
const known = new Set(Object.values(features).flatMap(s => [...s]));
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const denied = Object.freeze({ok:false,status:403,reason:'forbidden'});
const unauthenticated = Object.freeze({ok:false,status:401,reason:'unauthenticated'});
const unavailable = Object.freeze({ok:false,status:503,reason:'authorization-unavailable'});
/**
 * SERVER ONLY. action.kind and action.ownerId MUST come from a trusted route
 * and DB row, not the browser. Adapters MUST be trusted server implementations.
 * verifyAccessToken(token) => {userId,provider}, cryptographically validated.
 * loadServerIdentity(userId) => {role,audience}, from server-controlled record.
 * hasCurrentConsent(userId) => true for currently approved policy version.
 * Browser user_metadata, typed founder email and localStorage grant NO roles.
 */
export async function authorizeServerAction({authorization,action},adapters) {
  if (!action || typeof action !== 'object' || !['feature','admin','owner-data'].includes(action.kind)) return denied;
  if (action.kind === 'feature' && !known.has(action.feature)) return denied;
  if (action.kind !== 'admin' && (typeof action.ownerId !== 'string' || !uuid.test(action.ownerId))) return denied;
  if (!adapters || ['verifyAccessToken','loadServerIdentity','hasCurrentConsent'].some(k => typeof adapters[k] !== 'function')) return unavailable;
  if (typeof authorization !== 'string' || !/^Bearer [A-Za-z0-9._~+/-]+={0,2}$/.test(authorization)) return unauthenticated;
  let verified;
  try { verified = await adapters.verifyAccessToken(authorization.slice(7)); }
  catch { return unauthenticated; }
  if (!verified || typeof verified.userId !== 'string' || !uuid.test(verified.userId) || verified.provider !== 'google') return unauthenticated;
  let identity;
  try { identity = await adapters.loadServerIdentity(verified.userId); }
  catch { return unavailable; }
  if (!identity || !['admin','learner'].includes(identity.role)) return denied;
  if (action.kind !== 'admin' && action.ownerId !== verified.userId) return denied;
  if (action.kind === 'admin') return identity.role === 'admin' ? {ok:true,status:200,userId:verified.userId} : denied;
  if (identity.role !== 'learner' || !Object.hasOwn(features,identity.audience)) return denied;
  if (action.kind === 'feature' && !features[identity.audience].has(action.feature)) return denied;
  let consent;
  try { consent = await adapters.hasCurrentConsent(verified.userId); }
  catch { return unavailable; }
  if (consent !== true) return denied;
  return {ok:true,status:200,userId:verified.userId};
}

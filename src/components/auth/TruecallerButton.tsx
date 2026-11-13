import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';

type VerifiedProfile = { phone: string; name: string };
type Props = { onVerified?: (profile: VerifiedProfile) => void };
type Status = 'idle' | 'waiting' | 'verified' | 'unavailable' | 'failed';

export default function TruecallerButton({ onVerified }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [notice, setNotice] = useState('');
  const active = useRef(false);
  const partnerKey = String(import.meta.env.VITE_TRUECALLER_PARTNER_KEY || '').trim();
  const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);

  useEffect(() => () => { active.current = false; }, []);

  async function start(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (active.current || !isAndroid || !partnerKey) return;
    active.current = true;
    setNotice('Opening Truecaller…');
    setStatus('waiting');
    try {
      const started = await fetch('/api/truecaller-start', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: '{}', cache: 'no-store'
      });
      const ticket = await started.json();
      if (!started.ok || !ticket.requestId) throw Error(ticket.error || 'Unable to start verification');
      const params = new URLSearchParams({
        type: 'btmsheet',
        requestNonce: ticket.requestId,
        partnerKey,
        partnerName: 'Lanxgrow',
        lang: 'en',
        privacyUrl: location.origin + '/privacy',
        termsUrl: location.origin + '/terms',
        ttl: '60000',
        ctaColor: '#1D1A16',
        ctaTextColor: '#FFFFFF'
      });
      window.location.href = 'truecallersdk://truesdk/web_verify?' + params.toString();
      window.setTimeout(() => {
        if (active.current && document.hasFocus())
          setNotice('If Truecaller did not open, use the existing sign-in method below.');
      }, 700);
      const deadline = Date.now() + 60_000;
      let polling = false;
      const interval = window.setInterval(async () => {
        if (!active.current || polling) return;
        if (Date.now() > deadline) {
          window.clearInterval(interval);
          active.current = false;
          setStatus('unavailable');
          setNotice('Verification timed out. Try again or use your existing sign-in method.');
          return;
        }
        polling = true;
        try {
          const response = await fetch(
            '/api/truecaller-status?requestId=' + encodeURIComponent(ticket.requestId),
            { credentials: 'same-origin', cache: 'no-store' }
          );
          const result = await response.json();
          if (!response.ok) throw Error(result.error || 'Verification could not be completed');
          if (result.status === 'rejected') {
            window.clearInterval(interval);
            active.current = false;
            setStatus('unavailable');
            setNotice('Truecaller verification was cancelled. Use another sign-in option.');
          } else if (result.status === 'verified') {
            window.clearInterval(interval);
            active.current = false;
            setStatus('verified');
            setNotice('Phone verified. Account linking and an authenticated LanXgrow session are still required.');
            onVerified?.(result.profile);
            // Do not navigate to /dashboard here: no Supabase Auth session was issued.
          }
        } catch (error) {
          window.clearInterval(interval);
          active.current = false;
          setStatus('failed');
          setNotice(error instanceof Error ? error.message : 'Verification failed.');
        } finally { polling = false; }
      }, 2000);
    } catch (error) {
      active.current = false;
      setStatus('failed');
      setNotice(error instanceof Error ? error.message : 'Could not open Truecaller.');
    }
  }

  if (!isAndroid) {
    return <p className="login-availability">Truecaller mobile-web verification is supported in Android browsers. Use Google sign-in on this device.</p>;
  }
  if (!partnerKey) {
    return <p className="login-availability">Truecaller is not enabled in this test environment. Use Google sign-in.</p>;
  }
  return <div className="lx-truecaller">
    <button type="button" className="login-google" onClick={start} disabled={status === 'waiting'}>
      {status === 'waiting' ? 'Waiting for Truecaller…' : 'Continue with Truecaller'}
    </button>
    {notice && <p role="status" className="login-availability">{notice}</p>}
  </div>;
}

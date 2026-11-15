import { useEffect } from 'react';
/** Hands the visitor to the learning app (sign-up and login live there). */
export default function ExternalRedirect({ to }: { to: string }) {
  useEffect(() => { window.location.replace(to); }, [to]);
  return <main className="lx-container py-20"><p>Opening LanXgrow… <a href={to}>Continue</a></p></main>;
}

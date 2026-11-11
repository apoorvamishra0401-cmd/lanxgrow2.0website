import { Link } from 'react-router-dom';
import { Section } from '@/components/ui/Section';

export function AvailableNow() {
  return <Section id="available-now" tone="alabaster" divided spacing="tight">
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-widest text-ink-700">Before you begin</p>
      <h2 className="mt-4 font-display text-3xl leading-tight text-ink-900 sm:text-4xl">What you can try today.</h2>
      <p className="mt-5 text-base leading-relaxed text-ink-700">Explore the approach before choosing your next step. The public experiences below demonstrate how practice can work.</p>
    </div>
    <ul className="mt-8 grid gap-6 md:grid-cols-3">
      <li className="rounded-2xl border border-line bg-ivory p-6"><h3 className="font-display text-xl">Interview preparation</h3><p className="mt-3 text-sm leading-relaxed text-ink-700">Explore introductions, career tracks and an illustrative interview journey.</p><Link className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4" to="/interview-prep" reloadDocument>Explore interview preparation</Link></li>
      <li className="rounded-2xl border border-line bg-ivory p-6"><h3 className="font-display text-xl">Guided demonstrations</h3><p className="mt-3 text-sm leading-relaxed text-ink-700">Try scripted conversation and optional local voice or video rehearsal. Automated feedback is not enabled.</p><Link className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4" to="/smart-ai">Try SMART AI demonstrations</Link></li>
      <li className="rounded-2xl border border-line bg-ivory p-6"><h3 className="font-display text-xl">Programme details</h3><p className="mt-3 text-sm leading-relaxed text-ink-700">Ask about current availability, curriculum, fees and schedules before enrolling.</p><a className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4" href="mailto:official@lanxgrow.com">Email the LanXgrow team</a></li>
    </ul>
    <p className="mt-6 text-sm leading-relaxed text-ink-700">Live AI feedback and automated assessment reports are planned. <Link to="/faq" className="underline underline-offset-4">Read availability and privacy answers.</Link></p>
  </Section>;
}

import { PageIntro } from '@/components/ui/PageIntro';
import { Section } from '@/components/ui/Section';
import { usePageMeta } from '@/hooks/usePageMeta';
import { POLICY_EFFECTIVE_DATE, POLICY_VERSION } from '@/config/policies';
import { termsSections } from '@/content/terms';
export default function Terms() {
  usePageMeta('Terms and Conditions', 'Our commitments and shared responsibilities for your LanXgrow learning journey.');
  return <>
    <PageIntro eyebrow="Our shared commitment" heading="Terms and Conditions" supporting={`Version ${POLICY_VERSION} · Effective ${POLICY_EFFECTIVE_DATE}. Clear commitments. Respectful learning. A journey we build together.`} />
    <Section tone="ivory"><div className="max-w-prose">
      {termsSections.map(({ heading, body }) => <section className="mb-10" key={heading}><h2 className="font-display text-[1.5rem]">{heading}</h2><p className="lx-prose mt-4">{body}</p></section>)}
      <p className="text-sm text-ink-500 leading-relaxed">Previous version: <a className="underline underline-offset-4 inline-flex min-h-11 items-center" href="/policies/2026-10-24.1/terms.txt">24 October 2026</a></p>
    </div></Section>
  </>;
}

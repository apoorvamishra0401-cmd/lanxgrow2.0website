import { faqIntro, faqItems } from '@/content/faq';
import { PageIntro } from '@/components/ui/PageIntro';
import { Section } from '@/components/ui/Section';
import { Accordion } from '@/components/ui/Accordion';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { cta } from '@/config/site';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function Faq() {
  usePageMeta('FAQ', 'Answers to common questions about LanXgrow.');

  return (
    <>
      <PageIntro
        eyebrow={faqIntro.eyebrow}
        heading={faqIntro.heading}
        supporting={faqIntro.supporting}
      />

      <Section tone="ivory">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-8">
            <Accordion items={faqItems} defaultOpenId={faqItems[0]?.id} />
          </Reveal>

          <Reveal delay={90} className="lg:col-span-4">
            <div className="rounded-[20px] border border-line bg-sand/60 p-8">
              <h2 className="font-display text-[1.375rem] text-ink-900">Still have a question?</h2>
              <p className="mt-3 text-[0.9375rem] leading-[1.7] text-ink-500">
                Send it to the LanXgrow team and we will help you work out the right next step.
              </p>
              <div className="mt-7">
                <Button to={cta.talkToUs.to} variant="secondary" withArrow>
                  Get started
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}

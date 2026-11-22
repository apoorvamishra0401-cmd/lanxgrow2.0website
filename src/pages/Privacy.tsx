import { getPrivacySections, privacyIntro } from '@/content/privacy';
import { PageIntro } from '@/components/ui/PageIntro';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function Privacy() {
  usePageMeta('Privacy Notice', 'What the LanXgrow website does with your information.');

  const sections = [
    ...getPrivacySections(),
    {
      heading: 'What “instant fix” means',
      paragraphs: [
        '“Instant fix” means spotting gaps as soon as feedback is available and getting a practice step you can try right away. One attempt cannot permanently fix a skill or guarantee job readiness in seven days. Improvement takes regular practice.',
        'Where available, the CEFR-aligned (A1–C2) Readiness Score is an estimate based on the assessment evidence available for that attempt.',
      ],
    },
  ];

  return (
    <>
      <PageIntro
        eyebrow={privacyIntro.eyebrow}
        heading={privacyIntro.heading}
        supporting={privacyIntro.supporting}
      />

      <Section tone="ivory">
        <div className="max-w-prose">
          {sections.map((section, index) => (
            <Reveal
              key={section.heading}
              delay={index === 0 ? 0 : 40}
              className={index === 0 ? undefined : 'mt-12'}
            >
              <h2 className="font-display text-[1.375rem] text-ink-900 sm:text-[1.5rem]">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="lx-prose mt-4">
                  {paragraph}
                </p>
              ))}
            </Reveal>
          ))}
          <p className="text-sm text-ink-500 mt-10">Previous version: <a className="underline underline-offset-4 inline-flex min-h-11 items-center" href="/policies/2026-10-24.1/privacy.txt">24 October 2026</a></p>
        </div>
      </Section>
    </>
  );
}

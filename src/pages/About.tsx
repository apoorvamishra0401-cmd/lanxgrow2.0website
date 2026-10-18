import {
  aboutApproach,
  aboutCommitments,
  aboutIntro,
  aboutPhilosophy,
  aboutPurpose,
} from '@/content/about';
import { PageIntro } from '@/components/ui/PageIntro';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { cta } from '@/config/site';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function About() {
  usePageMeta('About', 'The purpose, philosophy and approach behind LanXgrow.');

  return (
    <>
      <PageIntro
        eyebrow={aboutIntro.eyebrow}
        heading={aboutIntro.heading}
        supporting={aboutIntro.supporting}
      />

      {/* Purpose */}
      <Section tone="ivory">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <Eyebrow>{aboutPurpose.eyebrow}</Eyebrow>
            <h2 className="mt-6 font-display text-display-sm text-ink-900">{aboutPurpose.heading}</h2>
          </Reveal>
          <Reveal delay={80} className="lg:col-span-7">
            {aboutPurpose.paragraphs.map((paragraph) => (
              <p key={paragraph} className="lx-prose">
                {paragraph}
              </p>
            ))}
          </Reveal>
        </div>
      </Section>

      {/* Philosophy */}
      <Section tone="alabaster" divided>
        <Reveal>
          <Eyebrow>{aboutPhilosophy.eyebrow}</Eyebrow>
          <h2 className="mt-6 max-w-2xl font-display text-display-sm text-ink-900">
            {aboutPhilosophy.heading}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8 lg:gap-12">
          {aboutPhilosophy.beliefs.map((belief, index) => (
            <Reveal key={belief.title} delay={index * 70} className="border-t border-line pt-6">
              <span aria-hidden="true" className="font-display text-[1.125rem] leading-none text-terracotta-400">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 font-display text-[1.25rem] text-ink-900">{belief.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-[1.7] text-ink-500">{belief.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Approach + commitments */}
      <Section tone="ivory" divided>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <Eyebrow>{aboutApproach.eyebrow}</Eyebrow>
            <h2 className="mt-6 max-w-xl font-display text-display-sm text-ink-900">
              {aboutApproach.heading}
            </h2>
            <div className="mt-7">
              {aboutApproach.body.map((paragraph) => (
                <p key={paragraph} className="lx-prose">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={90} className="lg:col-span-6 lg:pl-6">
            <div className="rounded-[20px] border border-line bg-sand/60 p-8 sm:p-10">
              <Eyebrow tone="muted">{aboutCommitments.eyebrow}</Eyebrow>
              <h2 className="mt-6 font-display text-[1.5rem] text-ink-900">
                {aboutCommitments.heading}
              </h2>
              <ul className="mt-7 space-y-4">
                {aboutCommitments.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[0.9375rem] leading-[1.7] text-ink-700">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      className="mt-1 h-4 w-4 shrink-0 text-terracotta-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3.5 8.5 6.5 11.5l6-7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-9">
                <Button to={cta.getStarted.to} withArrow>
                  {cta.getStarted.label}
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}

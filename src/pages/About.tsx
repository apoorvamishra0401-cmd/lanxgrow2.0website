import './About.css';
import {
  aboutApproach,
  aboutCommitments,
  aboutIntro,
  aboutPhilosophy,
  aboutProgress,
  aboutPurpose,
  aboutResearch,
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
    <div className="about-page">
      <PageIntro
        eyebrow={aboutIntro.eyebrow}
        heading={aboutIntro.heading}
        supporting={aboutIntro.supporting}
      />

      {/* Purpose, with the one research figure the site publishes. */}
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

        {/* Research note. The figure, age range, rural scope and reading-only
            limitation are always shown together, never as a spoken-English claim. */}
        <Reveal delay={120}>
          <figure className="about-research mt-14 grid gap-8 rounded-[20px] border border-line bg-sand/50 p-8 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-12 sm:p-10">
            <p className="font-display text-[3.25rem] leading-none text-ink-900 sm:text-[4.25rem]">
              {aboutResearch.figure}
            </p>
            <div>
              <figcaption>
                <p className="text-[1.0625rem] leading-[1.7] text-ink-700">
                  {aboutResearch.statement}
                </p>
              </figcaption>
              <p className="mt-4 border-t border-line pt-4 text-[0.8125rem] leading-relaxed text-ink-500">
                {aboutResearch.source}
              </p>
              <a className="about-source" href={aboutResearch.url} target="_blank" rel="noopener noreferrer">Read the ASER findings <span aria-hidden="true">↗</span></a>
            </div>
          </figure>
        </Reveal>
      </Section>

      {/* Progress — future-facing by design: no timeline, no outcome promise. */}
      <Section tone="alabaster" divided>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <Eyebrow>{aboutProgress.eyebrow}</Eyebrow>
            <h2 className="mt-6 max-w-xl font-display text-display-sm text-ink-900">
              {aboutProgress.heading}
            </h2>
          </Reveal>
          <Reveal delay={80} className="lg:col-span-7 lg:pt-2">
            <p className="lx-prose">{aboutProgress.body}</p>
          </Reveal>
        </div>
      </Section>

      {/* Philosophy */}
      <Section tone="ivory" divided>
        <Reveal>
          <Eyebrow>{aboutPhilosophy.eyebrow}</Eyebrow>
          <h2 className="mt-6 max-w-2xl font-display text-display-sm text-ink-900">
            {aboutPhilosophy.heading}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8 lg:gap-12">
          {aboutPhilosophy.beliefs.map((belief, index) => (
            <Reveal key={belief.title} delay={index * 70} className="about-belief border-t border-line pt-6">
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
      <Section tone="alabaster" divided>
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
<h3 className="mt-8 font-display text-[1.25rem] text-ink-900">A Learning Experience Built Around You</h3>
            <ul className="mt-7 space-y-4">
              <li key={1} className="flex items-start gap-3 text-[0.9375rem] leading-[1.7] text-ink-700">
                <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-1 h-4 w-4 shrink-0 text-terracotta-500" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3.5 8.5 6.5 11.5l6-7" /></svg>
                A structured starting point, with practice that connects to your learning goals.
              </li>
              <li key={2} className="flex items-start gap-3 text-[0.9375rem] leading-[1.7] text-ink-700">
                <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-1 h-4 w-4 shrink-0 text-terracotta-500" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3.5 8.5 6.5 11.5l6-7" /></svg>
                Purposeful guidance designed to turn reflection into a practical next step.
              </li>
              <li key={3} className="flex items-start gap-3 text-[0.9375rem] leading-[1.7] text-ink-700">
                <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-1 h-4 w-4 shrink-0 text-terracotta-500" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3.5 8.5 6.5 11.5l6-7" /></svg>
                Voice and video practice in development, designed to help you review how you communicate.
              </li>
              <li key={4} className="flex items-start gap-3 text-[0.9375rem] leading-[1.7] text-ink-700">
                <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-1 h-4 w-4 shrink-0 text-terracotta-500" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3.5 8.5 6.5 11.5l6-7" /></svg>
                Real situations at the centre: learn to share an idea, explain a decision and keep a conversation going.
              </li>
            </ul>
            <p className="mt-6 lx-prose text-ink-500">Your voice. Your pace. Your progress.</p>
          </Reveal>

          <Reveal delay={90} className="lg:col-span-6 lg:pl-6">
            <div className="about-commitments rounded-[20px] border border-line bg-ivory-50 p-8 sm:p-10">
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

              <p className="about-availability">These commitments guide the experience we’re building. Current and planned features are identified on the homepage.</p>
              <div className="mt-9">
                <Button to={cta.getStarted.to} withArrow>
                  {cta.getStarted.label}
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </div>
  );
}

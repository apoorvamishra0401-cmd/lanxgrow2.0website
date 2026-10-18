import { homeGetStarted } from '@/content/home';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';

/**
 * The intended customer journey: Explore → Connect → Learn and practise.
 *
 * Rendered as a connected sequence — the rule that follows each numeral runs
 * into the next column, so the three stages read as one path rather than three
 * separate cards. It describes the intended journey, not a service that is
 * already running.
 */
export function GetStarted() {
  return (
    <Section id="get-started" tone="alabaster" divided>
      <Reveal>
        <Eyebrow>{homeGetStarted.eyebrow}</Eyebrow>
        <h2 className="mt-6 max-w-2xl font-display text-display-sm text-ink-900">
          {homeGetStarted.heading}
        </h2>
      </Reveal>

      <ol className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8 lg:gap-12">
        {homeGetStarted.steps.map((step, index) => (
          <Reveal as="li" key={step.index} delay={index * 70}>
            <div className="flex items-center gap-4">
              <span aria-hidden="true" className="font-display text-[2rem] leading-none text-terracotta-300">
                {step.index}
              </span>
              <span aria-hidden="true" className="lx-rule flex-1" />
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta-400"
              />
            </div>
            <h3 className="mt-6 font-display text-[1.25rem] text-ink-900">{step.title}</h3>
            <p className="mt-3 text-[0.9375rem] leading-[1.7] text-ink-500">{step.body}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

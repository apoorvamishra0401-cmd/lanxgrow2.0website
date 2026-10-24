import { homeGetStarted } from '@/content/home';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';

/** Journey: Explore → Connect → Learn and Practise. */
export function Journey() {
  return (
    <Section id="journey" tone="alabaster" spacing="loose" divided>
      <Reveal>
        <Eyebrow>{homeGetStarted.eyebrow}</Eyebrow>
        <h2 className="mt-6 max-w-2xl font-display text-display-sm text-ink-900 sm:text-display-md">
          {homeGetStarted.heading}</h2>
      </Reveal>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {homeGetStarted.steps.map((step) => (
          <Reveal key={step.index} className="border border-line rounded-[20px] p-6 text-center">
            <div className="mt-2">
              <span className="font-display text-[1.125rem] font-semibold text-ink-900">{step.index}</span>
            </div>
            <h3 className="mt-3 font-display text-[1.25rem] text-ink-900">{step.title}</h3>
            <p className="mt-3 text-[0.9375rem] leading-[1.7] text-ink-500">{step.body}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
import { homeApproach } from '@/content/home';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';

/**
 * The compact brand story.
 *
 * Three pillars held together — English Communication, mentorship and Smart AI
 * assessments — stated in one line each, so the section reads quickly instead
 * of explaining at length.
 */
export function Approach() {
  return (
    <Section id="approach" tone="ivory">
      <Reveal>
        <Eyebrow>{homeApproach.eyebrow}</Eyebrow>
        <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:gap-16">
          <h2 className="font-display text-display-sm text-ink-900 lg:col-span-6">
            {homeApproach.heading}
          </h2>
          <p className="max-w-prose text-[1.0625rem] leading-[1.75] text-ink-500 lg:col-span-6 lg:pt-2">
            {homeApproach.intro}
          </p>
        </div>
      </Reveal>

      <ul className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8 lg:gap-12">
        {homeApproach.pillars.map((pillar, index) => (
          <Reveal as="li" key={pillar.title} delay={index * 70} className="border-t border-line pt-6">
            <h3 className="font-display text-[1.25rem] text-ink-900">{pillar.title}</h3>
            <p className="mt-3 text-[0.9375rem] leading-[1.7] text-ink-500">{pillar.body}</p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

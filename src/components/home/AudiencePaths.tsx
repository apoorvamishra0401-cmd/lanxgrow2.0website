import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import {
  journeyFraming,
  journeyParent,
  journeyProfessional,
} from '@/content/journeys';

/**
 * Two audience journeys side by side — parents & young learners,
 * and students, job seekers and professionals.
 *
 * Each path describes how the programme works. It does not promise enrolment,
 * outcomes, dashboards or live mentoring.
 */
export function AudiencePaths() {
  return (
    <Section id="journeys" tone="alabaster" spacing="loose" divided>
      <Reveal>
        <Eyebrow>{journeyFraming.eyebrow}</Eyebrow>
        <h2 className="mt-6 max-w-2xl font-display text-display-sm text-ink-900 sm:text-display-md">
          {journeyFraming.heading}
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-12 sm:grid-cols-2 sm:gap-8 lg:gap-16">
        {[
          journeyParent,
          journeyProfessional,
        ].map((journey) => (
          <Reveal
            key={journey.label}
            delay={journey === journeyParent ? 0 : 70}
            className="border border-line rounded-[20px] p-8 sm:p-10"
          >
            <div className="space-y-6">
              <p className="text-terracotta-600 font-semibold text-[0.875rem] uppercase tracking-[0.14em]">
                {journey.label}
              </p>
              <h3 className="mt-2 font-display text-[1.25rem] text-ink-900 sm:text-[1.5rem]">
                {journey.promise}
              </h3>
              <p className="mt-4 text-[0.9375rem] leading-[1.7] text-ink-500">
                {journey.supporting}
              </p>
              <ol className="mt-8 space-y-5">
                {journey.steps.map((step) => (
                  <li
                    key={step.index}
                    className="flex items-start gap-4"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1 shrink-0 font-display text-[1.125rem] leading-none text-terracotta-600"
                    >
                      {step.index}
                    </span>
                    <div>
                      <h4 className="font-display text-[0.9375rem] text-ink-900">
                        {step.title}
                      </h4>
                      <p className="mt-1.5 text-[0.875rem] leading-[1.7] text-ink-500">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
              <Button to={journey.cta.to} size="md" withArrow>
                {journey.cta.label}
              </Button>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16 pt-8 border-t border-line">
        <p className="max-w-prose mx-auto text-[0.9375rem] leading-[1.7] text-ink-500 text-center sm:text-left">
          {journeyFraming.closer}
        </p>
      </Reveal>
    </Section>
  );
}

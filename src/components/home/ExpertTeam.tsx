import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { homeProgrammes } from '@/content/home';
import { cta } from '@/config/site';

/**
 * Expert team and live learning programmes.
 *
 * Human expertise is communicated as a strength of the team and its live
 * programmes — not as a feature automatically bundled with the AI experience.
 */
export function ExpertTeam() {
  return (
    <Section id="programmes" tone="alabaster" spacing="loose" divided>
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow>{homeProgrammes.eyebrow}</Eyebrow>
            <h2 className="mt-6 max-w-xl font-display text-display-sm text-ink-900 sm:text-display-md">
              {homeProgrammes.heading}
            </h2>
            <p className="mt-7 max-w-prose text-[1.0625rem] leading-[1.75] text-ink-500">
              {homeProgrammes.body}
            </p>
            <p className="mt-8 text-[0.875rem] leading-relaxed text-ink-500 italic">
              {homeProgrammes.closer}
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-5">
          <div className="space-y-8">
            {homeProgrammes.points.map((point, index) => (
              <Reveal
                key={point.title}
                delay={index * 70}
                className="border border-line rounded-xl p-6"
              >
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-1 shrink-0 rounded-full bg-terracotta-100 p-1.5 text-terracotta-600 font-display text-[0.75rem]"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-display text-[1.125rem] text-ink-900">
                      {point.title}
                    </h3>
                    <p className="mt-1.5 text-[0.9375rem] leading-[1.7] text-ink-500">
                      {point.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <Button to={cta.talkToUs.to} size="md" withArrow className="mt-12">
        Talk to us about programmes
      </Button>
    </Section>
  );
}

import { homeHero } from '@/content/home';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { AssessmentShowcase } from '@/components/assessment/AssessmentShowcase';
import { TwoWaysOnePlan } from '@/components/visuals/TwoWaysOnePlan';

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      {/* Extremely subtle warm wash — one soft light source, no gradient noise. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_78%_18%,rgba(184,92,56,0.07),transparent_70%)]"
      />

      <Container>
        <div className="relative grid items-center gap-12 pb-16 pt-10 lg:grid-cols-12 lg:gap-16 lg:pb-20 lg:pt-14">
          {/* Copy */}
          <div className="lg:col-span-6">
            <Eyebrow>{homeHero.eyebrow}</Eyebrow>

            <h1 className="mt-7 max-w-xl text-balance font-display text-display-sm text-ink-900 sm:text-display-md lg:text-display-lg lg:text-wrap">
              {homeHero.headline}
            </h1>

            <p className="mt-6 max-w-prose text-[1.0625rem] leading-[1.75] text-ink-500">
              {homeHero.supporting}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button to={homeHero.primaryCta.to} size="lg" withArrow>
                {homeHero.primaryCta.label}
              </Button>
              <Button to={homeHero.secondaryCta.to} variant="secondary" size="lg">
                {homeHero.secondaryCta.label}
              </Button>
            </div>
          </div>

          {/* Product scene: the assessment interface itself, plus mentor note and depth block. */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              <div
                aria-hidden="true"
                className="absolute -right-4 -top-5 hidden h-full w-full rounded-[22px] border border-line bg-sand/70 sm:block"
              />

              <AssessmentShowcase className="relative" />

              {/* The human layer — expertise lives in live programmes, not bundled with every AI interaction. */}
              <div className="relative mt-5 max-w-sm rounded-2xl border border-line bg-ivory p-5 shadow-lift sm:ml-6">
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className="grid h-7 w-7 place-items-center rounded-full bg-ink-900 font-display text-[0.75rem] text-ivory-50"
                  >
                    L
                  </span>
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-500">
                    The human layer
                  </span>
                </div>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-ink-500">
                  Practice first. Perspective when you want it — LanXgrow live learning programmes.
                </p>

                {/* Both ways of beginning arrive at the same human plan. */}
                <div className="mt-4 border-t border-line pt-4">
                  <TwoWaysOnePlan />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

import { homeClosing } from '@/content/home';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';

export function ClosingCta() {
  return (
    <Section tone="ink" spacing="loose">
      <Container>
        <div className="py-20 sm:py-24 lg:py-28">
          <Reveal className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
            <div className="lg:col-span-7">
              <Eyebrow tone="muted">{homeClosing.eyebrow}</Eyebrow>
              <h2 className="mt-6 max-w-2xl font-display text-display-sm text-ivory-50 sm:text-display-md">
                {homeClosing.heading}
              </h2>
            </div>

            <div className="lg:col-span-5">
              <p className="max-w-prose text-[1.0625rem] leading-[1.75] text-ivory-100/80">
                {homeClosing.body}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button to={homeClosing.primaryCta.to} size="lg" withArrow>
                  {homeClosing.primaryCta.label}
                </Button>
                <Button to={homeClosing.secondaryCta.to} variant="onInkOutline" size="lg">
                  {homeClosing.secondaryCta.label}
                </Button>
              </div>


            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

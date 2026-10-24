import { homeWhyLanXgrow } from '@/content/home';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';

/** Why LanXgrow — English Communication core with AI support. */
export function WhyLanXgrow() {
  return (
    <Section id="why-lanxgrow" tone="alabaster" spacing="loose" divided>
      <Reveal>
        <Eyebrow>{homeWhyLanXgrow.eyebrow}</Eyebrow>
        <h2 className="mt-6 max-w-2xl font-display text-display-sm text-ink-900 sm:text-display-md">
          {homeWhyLanXgrow.heading}</h2>
        <p className="mt-6 max-w-prose text-[1.0625rem] leading-[1.75] text-ink-500">
          {homeWhyLanXgrow.intro}
        </p>
      </Reveal>
    </Section>
  );
}
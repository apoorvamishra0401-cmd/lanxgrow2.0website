import { homeSmartAi } from '@/content/home';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { SignalToGuidance } from '@/components/visuals/SignalToGuidance';

/**
 * Smart AI section.
 *
 * States the principle rather than listing capabilities — the voice and video
 * demonstration itself lives in the hero, so the page does not repeat it.
 */
export function SmartAi() {
  return (
    <Section id="smart-ai" tone="ink" spacing="loose">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-6">
          <Eyebrow tone="inverse">{homeSmartAi.eyebrow}</Eyebrow>
          <h2 className="mt-6 max-w-xl font-display text-display-sm text-ivory-50 sm:text-display-md">
            {homeSmartAi.heading}
          </h2>

          <p className="mt-7 max-w-prose text-[1.0625rem] leading-[1.75] text-ivory-100/75">
            {homeSmartAi.body}
          </p>

          <p className="mt-8 max-w-md text-[0.8125rem] leading-relaxed text-ivory-100/70">
            {homeSmartAi.disclaimer}
          </p>
        </Reveal>

        <Reveal delay={100} className="lg:col-span-6 lg:pl-4">
          {/* How a spoken answer becomes guidance. Illustrative, and said so. */}
          <div className="mb-9 max-w-2xl">
            <SignalToGuidance />
          </div>

          <ul className="border-t border-ivory-100/15">
            {homeSmartAi.markers.map((marker) => (
              <li key={marker.label} className="border-b border-ivory-100/15 py-6">
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta-400"
                  />
                  <div>
                    <h3 className="font-display text-[1.1875rem] text-ivory-50">{marker.label}</h3>
                    <p className="mt-1.5 text-[0.9375rem] leading-[1.7] text-ivory-100/65">
                      {marker.detail}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}

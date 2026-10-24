import { homeSmartAi } from '@/content/home';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';

/**
 * Smart AI section.
 *
 * Distinguishes capabilities verified as present in the product from
 * capabilities planned for the future. Nothing here claims scoring, accuracy
 * or performance guarantees.
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

          <div className="mt-10 border border-ivory-100/15 rounded-[20px] p-8 sm:p-10">
            <div className="grid gap-8 sm:grid-cols-2 sm:gap-6">
              <div className="border-b sm:border-b-0 sm:border-r border-ivory-100/15 pb-8 sm:pb-0 sm:pr-8">
                <h3 className="font-display text-[1rem] text-ivory-300 uppercase tracking-[0.14em] mb-4">
                  In the product today
                </h3>
                {homeSmartAi.verifiedToday.length > 0 ? (
                  <ul className="space-y-4 text-[0.9375rem] leading-[1.7] text-ivory-100/80">
                    {homeSmartAi.verifiedToday.map((item) => (
                      <li key={item.label}>
                        <span className="font-semibold text-ivory-100">{item.label}</span>{' '}
                        {item.detail}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[0.9375rem] leading-[1.7] text-ivory-100/70 italic">
                    Screens shown are from the LanXgrow app. Availability of
                    individual features varies as the product develops.
                  </p>
                )}
              </div>

              <div>
                <h3 className="font-display text-[1rem] text-terracotta-300 uppercase tracking-[0.14em] mb-4">
                  Being built next
                </h3>
                <ul className="space-y-4 text-[0.9375rem] leading-[1.7] text-ivory-100/80">
                  {homeSmartAi.plannedNext.map((item) => (
                    <li key={item.label}>
                      <span className="font-semibold text-terracotta-200">{item.label}</span>{' '}
                      {item.detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <p className="mt-8 max-w-md text-[0.8125rem] leading-relaxed text-ivory-100/70">
            {homeSmartAi.disclaimer}
          </p>
        </Reveal>

        <Reveal delay={100} className="lg:col-span-6 lg:pl-4">
          {/* How a spoken answer becomes guidance. Illustrative, and said so. */}
          <div className="mb-9 max-w-2xl">
          </div>

          <ul className="border-t border-ivory-100/15">
            {[
              { label: 'Voice or video', detail: 'Whichever feels natural.' },
              { label: 'A clearer starting point', detail: 'Guidance responds to the learner, not a script.' },
              { label: 'Human judgement', detail: 'Encouragement and direction stay with the mentor.' },
            ].map((marker) => (
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

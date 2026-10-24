import { useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { cn } from '@/lib/cn';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { ScreenshotFrame } from './ScreenshotFrame';
import { productScreens, productShowcase } from '@/content/product';

/**
 * The product journey.
 *
 * A vertical editorial index drives one large screen. Implemented as a real
 * ARIA tablist with roving tabindex so the whole journey is keyboard operable.
 * The only motion is the existing crossfade (`lx-scene-in`), which the global
 * reduced-motion guard neutralises; nothing animates continuously.
 */
export function ProductShowcase() {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const screen = productScreens[active];

  const tabId = (index: number) => `${baseId}-tab-${index}`;
  const panelId = `${baseId}-panel`;

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = productScreens.length - 1;
    let next: number | null = null;

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = index === last ? 0 : index + 1;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = last;

    if (next === null) return;

    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <Section id="experience" tone="alabaster" spacing="loose" divided>
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-6">
          <Eyebrow>{productShowcase.eyebrow}</Eyebrow>
          <h2 className="mt-6 max-w-2xl font-display text-display-sm text-ink-900 sm:text-display-md">
            {productShowcase.heading}
          </h2>
        </Reveal>

        <Reveal delay={80} className="lg:col-span-6 lg:pt-2">
          <p className="max-w-prose text-[1.0625rem] leading-[1.75] text-ink-500">
            {productShowcase.intro}
          </p>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-16">
        {/* Editorial step index */}
        <Reveal className="lg:col-span-6">
          <div
            role="tablist"
            aria-orientation="vertical"
            aria-label="The LanXgrow learning journey"
            className="flex flex-col"
          >
            {productScreens.map((item, index) => {
              const selected = index === active;

              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  type="button"
                  role="tab"
                  id={tabId(index)}
                  aria-selected={selected}
                  aria-controls={panelId}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(index)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  className={cn(
                    'group flex items-baseline gap-4 border-l-2 py-3.5 pl-5 pr-3 text-left transition-colors duration-300 ease-editorial sm:py-4',
                    selected ? 'border-terracotta-500' : 'border-line hover:border-ink-300',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'shrink-0 font-sans text-[0.6875rem] font-semibold tabular-nums tracking-[0.16em]',
                      selected ? 'text-terracotta-600' : 'text-ink-500',
                    )}
                  >
                    {item.step}
                  </span>
                  <span
                    className={cn(
                      'font-display text-[1.125rem] leading-snug transition-colors duration-300 sm:text-[1.25rem]',
                      selected ? 'text-ink-900' : 'text-ink-500 group-hover:text-ink-900',
                    )}
                  >
                    {item.title}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Active screen */}
        <Reveal delay={90} className="lg:col-span-6">
          <div className="relative mx-auto w-full max-w-[23rem] lg:mx-0">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-5 bottom-10 top-10 rounded-[36px] bg-sand/60"
            />

            <div
              key={screen.id}
              id={panelId}
              role="tabpanel"
              aria-labelledby={tabId(active)}
              className="lx-scene-in relative"
            >
              <ScreenshotFrame
                src={screen.src}
                alt={screen.alt}
                label={screen.label}
                priority={active === 0}
              />

              {/* Reserved height keeps the section stable while steps change. */}
              <div className="mt-6 min-h-[9rem] border-t border-line pt-5">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-terracotta-600">
                  {screen.step} / {String(productScreens.length).padStart(2, '0')}
                </p>
                <p className="mt-3 text-[0.9375rem] leading-[1.7] text-ink-500">
                  {screen.description}
                </p>
                <p className="mt-4 text-[0.75rem] leading-relaxed text-ink-500">
                  {productShowcase.note}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

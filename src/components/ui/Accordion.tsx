import { useId, useState } from 'react';
import { cn } from '@/lib/cn';

export type AccordionItem = {
  id: string;
  question: string;
  answer: string;
};

/**
 * Accessible disclosure list.
 *
 * Uses a real button per item with `aria-expanded` / `aria-controls`, so keyboard
 * and screen-reader behaviour is native. Height animates via a grid row trick,
 * which needs no fixed pixel measurements.
 */
export function Accordion({
  items,
  defaultOpenId,
  className,
}: {
  items: AccordionItem[];
  defaultOpenId?: string;
  className?: string;
}) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);
  const baseId = useId();

  return (
    <div className={cn('divide-y divide-line border-y border-line', className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        const panelId = `${baseId}-${item.id}-panel`;
        const buttonId = `${baseId}-${item.id}-button`;

        return (
          <div key={item.id}>
            {/* Each question is a section of the page, so it is an h2 directly
                under the page h1 — h3 would skip a level. */}
            <h2>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="group flex w-full items-start justify-between gap-6 py-6 text-left transition-colors duration-200 hover:text-terracotta-700"
              >
                <span className="font-display text-[1.1875rem] leading-snug text-ink-900 transition-colors group-hover:text-terracotta-700 sm:text-[1.3125rem]">
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-all duration-300 ease-editorial',
                    isOpen
                      ? 'rotate-45 border-terracotta-500 bg-terracotta-500 text-ivory-50'
                      : 'border-line text-ink-500 group-hover:border-terracotta-300 group-hover:text-terracotta-600',
                  )}
                >
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                    <path d="M8 3.5v9M3.5 8h9" />
                  </svg>
                </span>
              </button>
            </h2>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!isOpen}
              className={cn(
                'grid transition-all duration-500 ease-editorial',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-prose pb-7 pr-10 text-[1.0625rem] leading-[1.75] text-ink-500">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

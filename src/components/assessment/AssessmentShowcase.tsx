import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import { cn } from '@/lib/cn';
import {
  assessmentModes,
  assessmentScenes,
  assessmentShowcase,
  type AssessmentMode,
} from '@/content/assessment';
import { SceneProgress } from './SceneProgress';
import { VideoScene } from './VideoScene';
import { VoiceScene } from './VoiceScene';

/**
 * Voice / video assessment demonstration with an accessible tab selector.
 *
 * Switching tabs swaps the scene in place — no navigation, no backend. The
 * media area has a fixed height so switching never shifts the layout.
 */
export function AssessmentShowcase({
  defaultMode = 'voice',
  className,
}: {
  defaultMode?: AssessmentMode;
  className?: string;
}) {
  const reflectPointer = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return;
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--scene-x', `${(event.clientX-box.left)/box.width*100}%`);
    event.currentTarget.style.setProperty('--scene-y', `${(event.clientY-box.top)/box.height*100}%`);
  };
  const [mode, setMode] = useState<AssessmentMode>(defaultMode);
  const baseId = useId();
  const tabRefs = useRef<Partial<Record<AssessmentMode, HTMLButtonElement | null>>>({});

  const tabId = (value: AssessmentMode) => `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel`;

  /** Standard roving-tabindex behaviour for a tablist. */
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = assessmentModes.length - 1;
    let nextIndex: number | null = null;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = index === last ? 0 : index + 1;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = index === 0 ? last : index - 1;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = last;

    if (nextIndex === null) return;

    event.preventDefault();
    const nextMode = assessmentModes[nextIndex];
    setMode(nextMode);
    tabRefs.current[nextMode]?.focus();
  };

  return (
    <div
      onPointerMove={reflectPointer}
      className={cn(
        'assessment-live rounded-[22px] border border-line bg-ivory-50 p-5 shadow-soft sm:p-7',
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <div
          role="tablist"
          aria-label={assessmentShowcase.selectorLabel}
          className="inline-flex gap-1 rounded-full border border-line bg-sand/50 p-1"
        >
          {assessmentModes.map((value, index) => {
            const selected = value === mode;
            return (
              <button
                key={value}
                ref={(el) => {
                  tabRefs.current[value] = el;
                }}
                type="button"
                role="tab"
                id={tabId(value)}
                aria-selected={selected}
                aria-controls={panelId}
                tabIndex={selected ? 0 : -1}
                onClick={() => setMode(value)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className={cn(
                  'inline-flex min-h-11 items-center justify-center rounded-full px-3.5 py-1.5 text-[0.8125rem] font-medium transition-all duration-300 ease-editorial sm:min-h-0',
                  selected
                    ? 'bg-ivory-50 text-ink-900 shadow-soft'
                    : 'text-ink-500 hover:text-ink-700',
                )}
              >
                {assessmentScenes[value].tab}
              </button>
            );
          })}
        </div>

        <span className="inline-flex shrink-0 items-center rounded-full border border-terracotta-200 bg-terracotta-50 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-terracotta-700">
          {assessmentShowcase.smartAiLabel}
        </span>
      </div>

      {/* Keyed by mode so the scene fades in on switch and the progress restarts. */}
      <div
        key={mode}
        id={panelId}
        role="tabpanel"
        aria-labelledby={tabId(mode)}
        className="lx-scene-in mt-5"
      >
        <div className="h-56 sm:h-64">{mode === 'voice' ? <VoiceScene /> : <VideoScene />}</div>

        <div className="mt-5">
          <SceneProgress label={assessmentShowcase.progressLabel} />
          <p className="mt-3 text-[0.75rem] leading-relaxed text-ink-500">
            {assessmentShowcase.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}

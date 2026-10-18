import { cn } from '@/lib/cn';

/**
 * Abstract illustration of a learner inside a video frame.
 *
 * Deliberately faceless and geometric: it reads as a depicted learner rather
 * than a real person, so nothing implies a real likeness is being shown or
 * analysed. Built from plain shapes (no gradients, no <defs>), which keeps it
 * crisp at any size and free of id collisions when rendered more than once.
 */
const PALETTE = {
  light: {
    frame: '#EFE7DC',
    halo: '#F8F2EA',
    shadow: 'rgba(29, 26, 22, 0.06)',
    body: '#CDB49C',
    skin: '#D9C4AD',
    neck: '#BFA189',
    hair: '#B99B80',
    rim: '#FCF8F2',
  },
  dark: {
    frame: '#2A2620',
    halo: '#332E27',
    shadow: 'rgba(0, 0, 0, 0.18)',
    body: '#6B5A49',
    skin: '#8A7460',
    neck: '#7A6653',
    hair: '#5A4A3B',
    rim: '#C9AE94',
  },
} as const;

export function LearnerPortrait({
  className,
  tone = 'light',
}: {
  className?: string;
  tone?: 'light' | 'dark';
}) {
  const c = PALETTE[tone];

  return (
    <svg
      viewBox="0 0 400 225"
      preserveAspectRatio="xMidYMid slice"
      className={cn('block', className)}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="400" height="225" fill={c.frame} />
      <circle cx="200" cy="102" r="82" fill={c.halo} />
      <ellipse cx="200" cy="223" rx="98" ry="11" fill={c.shadow} />

      {/* Shoulders and neck */}
      <rect x="186" y="130" width="28" height="32" rx="14" fill={c.neck} />
      <path d="M92 225c0-46 48-73 108-73s108 27 108 73z" fill={c.body} />

      {/* Head and hair, with a soft rim light on one side */}
      <circle cx="200" cy="102" r="42" fill={c.skin} />
      <path d="M158 102a42 42 0 0 1 84 0c0-26-19-45-42-45s-42 19-42 45z" fill={c.hair} />
      <path
        d="M163 86a42 42 0 0 0-4 17"
        stroke={c.rim}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
    </svg>
  );
}

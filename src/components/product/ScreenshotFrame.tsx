import { cn } from '@/lib/cn';

/**
 * A consistent frame around a product screenshot.
 *
 * The source images already include their own device chrome in places, so this
 * deliberately adds no fake phone bezel — only a quiet border, radius and
 * shadow. The 24:43 box matches the assets exactly, and `object-contain`
 * guarantees the interface is never cropped on any viewport.
 */
export function ScreenshotFrame({
  src,
  alt,
  label,
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  label: string;
  /** Load eagerly only for the first, above-the-fold screen. */
  priority?: boolean;
  className?: string;
}) {
  return (
    <figure className={cn('m-0', className)}>
      <div className="overflow-hidden rounded-[26px] border border-line bg-ivory-50 shadow-lift ring-1 ring-ink-900/[0.03]">
        <div className="aspect-[24/43] w-full">
          <img
            src={src}
            alt={alt}
            width={768}
            height={1376}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
      <figcaption className="mt-4 flex items-center justify-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ink-500">
        <span aria-hidden="true" className="h-1 w-1 rounded-full bg-terracotta-400" />
        {label}
      </figcaption>
    </figure>
  );
}

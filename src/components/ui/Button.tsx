import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'onInk' | 'onInkOutline';
type Size = 'sm' | 'md' | 'lg';

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Renders a trailing arrow that nudges on hover. */
  withArrow?: boolean;
  fullWidth?: boolean;
};

type ButtonAsButton = BaseProps & {
  to?: undefined;
  href?: undefined;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
};

type ButtonAsLink = BaseProps & { to: string; href?: undefined };
type ButtonAsAnchor = BaseProps & { href: string; to?: undefined };

export type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor;

const base =
  'group min-h-11 max-w-full inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 ease-editorial disabled:cursor-not-allowed disabled:opacity-55';

const variants: Record<Variant, string> = {
  primary:
    'bg-ink-900 text-ivory-50 hover:bg-terracotta-700 shadow-soft hover:shadow-lift',
  secondary:
    'border border-line bg-ivory-50/60 text-ink-900 hover:border-terracotta-300 hover:bg-ivory-50 hover:text-terracotta-700',
  ghost: 'text-ink-700 hover:text-terracotta-700',
  onInk:
    'bg-ivory-50 text-ink-900 hover:bg-terracotta-500 hover:text-ivory-50 shadow-soft',
  onInkOutline:
    'border border-ivory-100/25 text-ivory-100 hover:border-terracotta-300 hover:text-terracotta-100',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-[0.8125rem]',
  md: 'px-6 py-3 text-[0.9375rem]',
  // Mobile-first: tighter padding and a 15px label keep full-width CTAs on a
  // single line at 320px, then restore the approved desktop sizing at `sm`.
  lg: 'px-5 py-3.5 text-[0.9375rem] sm:px-8 sm:text-base',
};

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 transition-transform duration-300 ease-editorial group-hover:translate-x-0.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 8h11M9.5 4l4 4-4 4" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 animate-spin"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
    >
      <path d="M12 3a9 9 0 1 0 9 9" opacity="0.9" />
    </svg>
  );
}

export function Button(props: ButtonProps) {
  const {
    children,
    variant = 'primary',
    size = 'md',
    className,
    withArrow = false,
    fullWidth = false,
  } = props;

  const classes = cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className);

  const content = (
    <>
      {children}
      {withArrow && <Arrow />}
    </>
  );

  if ('to' in props && props.to) {
    return (
      <Link to={props.to} className={classes}>
        {content}
      </Link>
    );
  }

  if ('href' in props && props.href) {
    const external = /^https?:\/\//.test(props.href);
    return (
      <a
        href={props.href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      >
        {content}
      </a>
    );
  }

  const { onClick, type = 'button', disabled, loading } = props as ButtonAsButton;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classes}
    >
      {loading && <Spinner />}
      {content}
    </button>
  );
}

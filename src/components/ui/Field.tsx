import { cloneElement, forwardRef, isValidElement, useId } from 'react';
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/* --------------------------------------------------------------------------
   Shared field chrome: label, hint, error messaging and accessible wiring.
   Every control below renders through `Field` so validation styling stays
   identical across the site.
   -------------------------------------------------------------------------- */

type FieldProps = {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
};

export function Field({ label, htmlFor, hint, error, required, children, className }: FieldProps) {
  const hintId = hint ? `${htmlFor}-hint` : undefined;
  const errorId = error ? `${htmlFor}-error` : undefined;

  // Point the control at whichever message is rendered, so assistive technology
  // reads the error (or hint) together with the field it belongs to.
  const describedBy = error ? errorId : hintId;
  const control =
    describedBy && isValidElement<{ 'aria-describedby'?: string }>(children)
      ? cloneElement(children, { 'aria-describedby': describedBy })
      : children;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={htmlFor} className="text-[0.8125rem] font-medium tracking-wide text-ink-700">
        {label}
        {required ? (
          <span className="text-terracotta-600" aria-hidden="true">
            {' '}
            *
          </span>
        ) : (
          <span className="font-normal text-ink-500"> (optional)</span>
        )}
        {required && <span className="sr-only"> (required)</span>}
      </label>

      {control}

      {error ? (
        <p id={errorId} className="flex items-start gap-1.5 text-[0.8125rem] text-terracotta-700">
          <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-0.5 h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="8" cy="8" r="6.25" />
            <path d="M8 5v3.5M8 10.75h.01" />
          </svg>
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-[0.8125rem] text-ink-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

const controlBase =
  'w-full rounded-xl border bg-ivory-50 px-4 py-3 text-[0.9375rem] text-ink-900 placeholder:text-ink-300 transition-colors duration-200 ease-editorial disabled:cursor-not-allowed disabled:bg-ivory-100 disabled:text-ink-400';
const controlIdle = 'border-line hover:border-ink-300 focus:border-terracotta-500';
const controlError = 'border-terracotta-500 bg-terracotta-50/40';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }>(
  function Input({ className, invalid, ...props }, ref) {
    return (
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(controlBase, invalid ? controlError : controlIdle, className)}
        {...props}
      />
    );
  },
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }
>(function Textarea({ className, invalid, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(controlBase, 'resize-y', invalid ? controlError : controlIdle, className)}
      {...props}
    />
  );
});

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }
>(function Select({ className, invalid, children, ...props }, ref) {
  return (
    <div className="relative">
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(
          controlBase,
          'appearance-none pr-11',
          invalid ? controlError : controlIdle,
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 6.5 8 10.5l4-4" />
      </svg>
    </div>
  );
});

/** Convenience hook so pages can wire label/control ids without repetition. */
export function useFieldId(prefix: string) {
  const id = useId();
  return `${prefix}-${id.replace(/[:]/g, '')}`;
}

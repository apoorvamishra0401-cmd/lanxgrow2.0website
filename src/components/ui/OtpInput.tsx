import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';

/** Number of digits in a verification code. Shared with the sign-in page. */
export const OTP_LENGTH = 6;

/**
 * Six-digit OTP entry.
 *
 * Stage 1 scope: this is a fully working *interface* — keyboard navigation,
 * paste-to-fill, backspace and error styling all behave correctly — but it is
 * not wired to any verification service.
 *
 * The value is a fixed six-slot array rather than a packed string, so digits
 * keep their position when one is corrected, deleted or typed out of order.
 */
export function OtpInput({
  value,
  onChange,
  invalid = false,
  disabled = false,
  describedBy,
  groupLabel,
  digitLabel,
  autoFocus = false,
}: {
  /** Exactly six slots; each entry is a single digit or an empty string. */
  value: string[];
  onChange: (next: string[]) => void;
  invalid?: boolean;
  disabled?: boolean;
  /** Id of the message (e.g. an error) that describes this group. */
  describedBy?: string;
  groupLabel: string;
  digitLabel: (position: number) => string;
  autoFocus?: boolean;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length: OTP_LENGTH }, (_, i) => (value[i] ?? '').slice(0, 1));

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  const setDigit = (index: number, char: string) => {
    const next = digits.slice();
    next[index] = char;
    onChange(next);
  };

  const handleChange = (index: number, raw: string) => {
    const numeric = raw.replace(/\D/g, '');
    if (!numeric) {
      setDigit(index, '');
      return;
    }

    // Typing multiple characters (including paste) fills forward.
    const next = digits.slice();
    for (let offset = 0; offset < numeric.length && index + offset < OTP_LENGTH; offset += 1) {
      next[index + offset] = numeric[offset];
    }
    onChange(next);

    const focusIndex = Math.min(index + numeric.length, OTP_LENGTH - 1);
    refs.current[focusIndex]?.focus();
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (digits[index]) {
        setDigit(index, '');
      } else if (index > 0) {
        setDigit(index - 1, '');
        refs.current[index - 1]?.focus();
      }
      return;
    }
    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      refs.current[index - 1]?.focus();
    }
    if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      event.preventDefault();
      refs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (index: number, event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '');
    if (!pasted) return;
    event.preventDefault();
    handleChange(index, pasted);
  };

  return (
    <div role="group" aria-label={groupLabel} aria-describedby={describedBy} className="flex gap-2 sm:gap-3">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            refs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-label={digitLabel(index + 1)}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={(e) => handlePaste(index, e)}
          onFocus={(e) => e.currentTarget.select()}
          className={cn(
            'h-14 w-full min-w-0 rounded-xl border bg-ivory-50 text-center font-display text-[1.5rem] leading-none text-ink-900 transition-all duration-200 ease-editorial',
            'focus:border-terracotta-500 focus:shadow-soft',
            invalid ? 'border-terracotta-500 bg-terracotta-50/50' : 'border-line',
            disabled && 'opacity-55',
          )}
        />
      ))}
    </div>
  );
}

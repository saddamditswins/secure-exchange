import { useRef, type ClipboardEvent, type KeyboardEvent } from 'react';
import { useExternalTheme } from '../../contexts/ExternalThemeContext';

interface OtpInputProps {
  /** Current code. May be shorter than `length` while being typed. */
  value: string;
  onChange: (code: string) => void;
  /** Called once the final digit lands, with the complete code. */
  onComplete?: (code: string) => void;
  length?: number;
  disabled?: boolean;
  hasError?: boolean;
  /** Tailwind sizing for each box, e.g. "w-12 h-14 text-2xl rounded-xl". */
  boxClassName?: string;
  /** Accessible name for the group of inputs. */
  label?: string;
}

/**
 * Split single-character OTP entry.
 *
 * Shared by both external flows. Previously each flow had its own copy and they
 * drifted: only one supported pasting a code, and neither set
 * `autocomplete="one-time-code"`, so SMS/email autofill never offered the code.
 */
export function OtpInput({
  value,
  onChange,
  onComplete,
  length = 6,
  disabled = false,
  hasError = false,
  boxClassName = 'w-12 h-12 text-xl rounded-lg',
  label = 'One-time passcode',
}: OtpInputProps) {
  const { tokens } = useExternalTheme();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  const commit = (next: string) => {
    onChange(next);
    if (next.length === length && !next.includes(' ')) onComplete?.(next);
  };

  const setDigit = (index: number, digit: string) => {
    const next = digits.map((d, i) => (i === index ? digit : d));
    // Pad with spaces so a gap in the middle cannot silently shorten the code.
    commit(next.join('').replace(/\s+$/, ''));
  };

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1);
    if (!digit && raw !== '') return;

    setDigit(index, digit);
    if (digit && index < length - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      e.preventDefault();
      setDigit(index - 1, '');
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  /** Accepts a full code pasted into any box, ignoring separators. */
  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;
    e.preventDefault();
    commit(pasted);
    inputRefs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div
      className="flex gap-2 justify-center"
      onPaste={handlePaste}
      role="group"
      aria-label={label}
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          // Lets iOS/Android offer the code straight from the SMS or email.
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          disabled={disabled}
          value={digit}
          aria-label={`Digit ${index + 1} of ${length}`}
          aria-invalid={hasError || undefined}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={(e) => e.currentTarget.select()}
          className={`${boxClassName} text-center font-semibold border-2 transition-all outline-none disabled:opacity-50`}
          style={{
            backgroundColor: tokens.surface.elevated,
            borderColor: hasError
              ? tokens.status.warning
              : digit
                ? tokens.brand.primary
                : tokens.border.soft,
            color: tokens.text.primary,
          }}
        />
      ))}
    </div>
  );
}

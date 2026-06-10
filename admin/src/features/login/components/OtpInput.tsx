'use client';

import { useRef, useEffect, useCallback } from 'react';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  error?: boolean;
}

export function OtpInput({
  length = 6,
  value,
  onChange,
  isLoading,
  disabled,
  error,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const focusInput = useCallback((index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, length - 1));
    inputRefs.current[clampedIndex]?.focus();
  }, [length]);

  const setValue = useCallback((otp: string) => {
    const sanitized = otp.replace(/\D/g, '').slice(0, length);
    onChange(sanitized);
  }, [length, onChange]);

  const handleChange = useCallback((index: number, char: string) => {
    if (char && !/^\d$/.test(char)) return;

    const digits = value.split('');
    digits[index] = char;
    setValue(digits.join(''));

    if (char && index < length - 1) {
      focusInput(index + 1);
    }
  }, [value, length, setValue, focusInput]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const digits = value.split('');

      if (digits[index]) {
        digits[index] = '';
        setValue(digits.join(''));
      } else if (index > 0) {
        digits[index - 1] = '';
        setValue(digits.join(''));
        focusInput(index - 1);
      }
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      focusInput(index - 1);
    }

    if (e.key === 'ArrowRight' && index < length - 1) {
      focusInput(index + 1);
    }
  }, [value, length, setValue, focusInput]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    setValue(pasted);

    const pastedLength = pasted.replace(/\D/g, '').slice(0, length).length;
    focusInput(Math.min(pastedLength, length) - 1);
  }, [length, setValue, focusInput]);

  const handleClick = useCallback((index: number) => {
    if (!value && index > 0) {
      focusInput(0);
    }
  }, [value, focusInput]);

  const borderColor = error
    ? 'border-red-500 focus:border-red-500'
    : 'border-gray-200 border-2 focus:border-[#D4AF37';

  return (
    <div ref={containerRef} className="flex gap-2 justify-center" onPaste={handlePaste}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onClick={() => handleClick(index)}
          aria-label={`Digit ${index + 1} of ${length}`}
          disabled={isLoading || disabled}
          className={`w-14 h-16 text-center text-black text-3xl font-normal border-2 rounded-xl outline-none ring-0 focus:ring-2 focus:ring-[#D4AF37] focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${borderColor}`}
        />
      ))}
    </div>
  );
}

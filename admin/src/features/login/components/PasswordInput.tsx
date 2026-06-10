import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { LoginFormData } from '../types/login.types';

interface PasswordInputProps {
  register: UseFormRegister<LoginFormData>;
  errors: FieldErrors<LoginFormData>;
  showPassword: boolean;
  onToggleVisibility: () => void;
  onForgotPassword: () => void;
  disabled?: boolean;
}

export function PasswordInput({
  register,
  errors,
  showPassword,
  onToggleVisibility,
  onForgotPassword,
  disabled,
}: PasswordInputProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label
          htmlFor="password"
          className="block text-base font-bold text-black"
        >
          Password
        </label>
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm font-semibold text-[#D4AF37]"
          disabled={disabled}
        >
          Forgot password?
        </button>
      </div>
      <div className="relative">
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
          className={`w-full px-4 py-3.5 pr-10 border rounded-xl text-base font-medium text-black ${
            errors.password ? 'border-red-500' : 'border-gray-200'
          } focus:ring-2 focus:ring-[#D4AF37] outline-none`}
          placeholder="Enter your password"
          disabled={disabled}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          {showPassword ? (
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          ) : (
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>
      {errors.password && (
        <p className="mt-2 text-sm font-semibold text-red-600">{errors.password.message}</p>
      )}
    </div>
  );
}

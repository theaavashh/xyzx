import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { LoginFormData } from '../types/login.types';

interface EmailInputProps {
  register: UseFormRegister<LoginFormData>;
  errors: FieldErrors<LoginFormData>;
  disabled?: boolean;
}

export function EmailInput({ register, errors, disabled }: EmailInputProps) {
  return (
    <div>
      <label
        htmlFor="email"
        className="block text-base font-bold text-black mb-1.5"
      >
        Email
      </label>
      <input
        id="email"
        type="email"
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: 'Please enter a valid email address',
          },
        })}
        className={`w-full px-4 py-3.5 border rounded-xl text-base font-medium text-black ${
          errors.email ? 'border-red-500' : 'border-gray-200'
        } focus:ring-2 focus:ring-[#D4AF37] outline-none`}
        placeholder="Enter email address"
        disabled={disabled}
      />
      {errors.email && (
        <p className="mt-2 text-sm font-semibold text-red-600">{errors.email.message}</p>
      )}
    </div>
  );
}

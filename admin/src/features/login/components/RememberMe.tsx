import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { LoginFormData } from '../types/login.types';

interface RememberMeProps {
  register: UseFormRegister<LoginFormData>;
  disabled?: boolean;
}

export function RememberMe({ register, disabled }: RememberMeProps) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id="rememberMe"
        {...register('rememberMe')}
        className="h-5 w-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
        disabled={disabled}
      />
      <label htmlFor="rememberMe" className="ml-3 block text-base font-semibold text-black">
        Remember me
      </label>
    </div>
  );
}

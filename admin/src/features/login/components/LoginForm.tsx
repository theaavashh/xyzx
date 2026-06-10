import {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
} from 'react-hook-form';
import { LoginFormData } from '../types/login.types';
import { EmailInput } from './EmailInput';
import { PasswordInput } from './PasswordInput';
import { RememberMe } from './RememberMe';
import { SubmitButton } from './SubmitButton';

interface LoginFormProps {
  register: UseFormRegister<LoginFormData>;
  errors: FieldErrors<LoginFormData>;
  handleSubmit: UseFormHandleSubmit<LoginFormData>;
  onSubmit: (data: LoginFormData) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  onForgotPassword: () => void;
  isLoading: boolean;
}

export function LoginForm({
  register,
  errors,
  handleSubmit,
  onSubmit,
  showPassword,
  onTogglePassword,
  onForgotPassword,
  isLoading,
}: LoginFormProps) {
  return (
    <div className="space-y-5">
      <EmailInput register={register} errors={errors} disabled={isLoading} />
      <PasswordInput
        register={register}
        errors={errors}
        showPassword={showPassword}
        onToggleVisibility={onTogglePassword}
        onForgotPassword={onForgotPassword}
        disabled={isLoading}
      />
      <RememberMe register={register} disabled={isLoading} />
      <SubmitButton isLoading={isLoading}>Login</SubmitButton>
    </div>
  );
}

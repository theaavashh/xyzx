'use client';

import type {
  InputFieldProps,
  TextAreaFieldProps,
  SelectFieldProps,
  CheckboxFieldProps,
} from '@/types';

export function InputField({ label, value, onChange, type = 'text', ...props }: InputFieldProps & Record<string, unknown>) {
  return (
    <div>
      <label className="block text-sm font-medium custom-font text-black mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-black"
        {...props}
      />
    </div>
  );
}

export function TextAreaField({ label, value, onChange, rows = 4, ...props }: TextAreaFieldProps & Record<string, unknown>) {
  return (
    <div>
      <label className="block text-sm font-medium custom-font text-black mb-2">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-black"
        {...props}
      />
    </div>
  );
}

export function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium custom-font text-black mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-black"
      >
        {options.map((option: string) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export function CheckboxField({ label, checked, onChange }: CheckboxFieldProps) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37]"
      />
      <label className="ml-2 text-sm custom-font text-black">{label}</label>
    </div>
  );
}

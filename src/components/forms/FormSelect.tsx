import { ReactNode } from "react";

interface FormSelectProps {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  error?: string;
  disabled?: boolean;
  register: any;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function FormSelect({
  label,
  name,
  options,
  error,
  disabled,
  register,
  required = false,
  value,
  onChange,
}: FormSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <select
        {...register(name)}
        disabled={disabled}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-black bg-background text-foreground ${
          error ? "border-destructive" : ""
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}

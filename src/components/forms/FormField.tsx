import { ReactNode } from "react";
import { Input } from "@/components/ui/input";

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  register: any;
  required?: boolean;
}

export function FormField({
  label,
  name,
  type = "text",
  placeholder,
  error,
  disabled,
  register,
  required = false,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <Input
        placeholder={placeholder}
        type={type}
        {...register(name)}
        disabled={disabled}
        className={error ? "border-destructive" : ""}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}

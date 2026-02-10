import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface FormWrapperProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
  isLoading?: boolean;
  footer?: ReactNode;
}

export function FormWrapper({
  title,
  subtitle,
  children,
  onSubmit,
  submitLabel,
  isLoading = false,
  footer,
}: FormWrapperProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-2xl shadow-lg border">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {children}
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Processing..." : submitLabel}
          </Button>
        </form>

        {footer && <div className="text-center text-sm">{footer}</div>}
      </div>
    </div>
  );
}

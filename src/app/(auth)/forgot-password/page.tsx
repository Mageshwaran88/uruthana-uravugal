"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  ForgotPasswordType,
  resetPasswordWithOtpSchema,
  ResetPasswordWithOtpType,
} from "@/types/auth";
import { authApi } from "@/lib/api/auth";
import { toast } from "sonner";
import Link from "next/link";
import { FormWrapper, FormField } from "@/components/forms";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"request" | "reset">("request");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const requestForm = useForm<ForgotPasswordType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<ResetPasswordWithOtpType>({
    resolver: zodResolver(resetPasswordWithOtpSchema),
    defaultValues: { identifier: "", otp: "", newPassword: "" },
  });

  async function onRequestOtp(values: ForgotPasswordType) {
    try {
      setIsLoading(true);
      await authApi.forgotPassword({ email: values.email });
      const id = values.email.trim();
      setEmail(id);
      resetForm.setValue("identifier", id);
      setStep("reset");
      toast.success("OTP sent to your email.");
    } catch (e) {
      toast.error((e as Error).message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  }

  async function onResetPassword(values: ResetPasswordWithOtpType) {
    try {
      setIsLoading(true);
      await authApi.resetPasswordWithOtp(values);
      toast.success("Password reset. You can sign in now.");
      window.location.href = "/login";
    } catch (e) {
      toast.error((e as Error).message || "Reset failed");
    } finally {
      setIsLoading(false);
    }
  }

  if (step === "reset") {
    return (
      <FormWrapper
        title="Set new password"
        subtitle={`Enter the OTP sent to ${email}`}
        onSubmit={resetForm.handleSubmit(onResetPassword)}
        submitLabel="Reset password"
        isLoading={isLoading}
        footer={
          <>
            <button
              type="button"
              onClick={() => setStep("request")}
              className="text-primary hover:underline"
            >
              Use different email
            </button>
            <span className="mx-2">·</span>
            <Link href="/login" className="text-primary hover:underline">
              Back to sign in
            </Link>
          </>
        }
      >
        <input type="hidden" {...resetForm.register("identifier")} />
        <FormField
          label="OTP"
          name="otp"
          placeholder="6-digit code from email"
          error={resetForm.formState.errors.otp?.message}
          disabled={isLoading}
          register={resetForm.register}
          required
        />
        <FormField
          label="New password"
          name="newPassword"
          type="password"
          placeholder="Min 6 characters"
          error={resetForm.formState.errors.newPassword?.message}
          disabled={isLoading}
          register={resetForm.register}
          required
        />
      </FormWrapper>
    );
  }

  return (
    <FormWrapper
      title="Forgot password"
      subtitle="Enter your email to receive an OTP (forgot password uses email only)"
      onSubmit={requestForm.handleSubmit(onRequestOtp)}
      submitLabel="Send OTP"
      isLoading={isLoading}
      footer={
        <>
          <span className="text-muted-foreground">Remember it? </span>
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <FormField
        label="Email"
        name="email"
        type="email"
        placeholder="you@example.com"
        error={requestForm.formState.errors.email?.message}
        disabled={isLoading}
        register={requestForm.register}
        required
      />
    </FormWrapper>
  );
}

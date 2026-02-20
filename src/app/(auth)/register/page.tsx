"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterType } from "@/types/auth";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { FormWrapper, FormField } from "@/components/forms";
import { authApi } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";

export default function Register() {
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const form = useForm<RegisterType>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", otp: "", username: "", mobile: "" },
  });

  async function onSendOtp() {
    const email = form.getValues("email").trim();
    if (!email || !email.includes("@")) {
      toast.error("Enter a valid email first");
      return;
    }
    try {
      setIsLoading(true);
      await authApi.sendOtp({
        identifier: email,
        purpose: "REGISTER",
        channel: "EMAIL",
      });
      setOtpSent(true);
      toast.success("OTP sent to your email.");
    } catch (e) {
      toast.error((e as Error).message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(values: RegisterType) {
    if (!otpSent) {
      toast.error("Please send OTP first.");
      return;
    }
    try {
      setIsLoading(true);
      await registerUser({
        email: values.email.trim().toLowerCase(),
        otp: values.otp,
        password: values.password,
        username: values.username?.trim() || undefined,
        mobile: values.mobile?.trim() || undefined,
      });
      toast.success("Account created successfully!");
    } catch (error: unknown) {
      toast.error((error as Error).message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <FormWrapper
      title="Create Account"
      subtitle="Sign up with your email. We'll send an OTP to your email (no mobile/SMS)."
      onSubmit={form.handleSubmit(onSubmit)}
      submitLabel="Create Account"
      isLoading={isLoading}
      footer={
        <>
          <span className="text-muted-foreground">Already have an account? </span>
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
        error={form.formState.errors.email?.message}
        disabled={isLoading || otpSent}
        register={form.register}
        required
      />
      <FormField
        label="Username"
        name="username"
        type="text"
        placeholder="Display name (optional)"
        error={form.formState.errors.username?.message}
        disabled={isLoading}
        register={form.register}
      />
      <FormField
        label="Mobile number"
        name="mobile"
        type="tel"
        placeholder="e.g. +91 98765 43210 (optional)"
        error={form.formState.errors.mobile?.message}
        disabled={isLoading}
        register={form.register}
      />
      <div className="space-y-2">
        <div className="flex gap-2">
          <FormField
            label="OTP (sent to email)"
            name="otp"
            placeholder="6-digit code"
            error={form.formState.errors.otp?.message}
            disabled={isLoading}
            register={form.register}
          />
          <div className="pt-8">
            <Button
              type="button"
              variant="outline"
              onClick={onSendOtp}
              disabled={isLoading || otpSent}
            >
              {otpSent ? "Sent" : "Send OTP"}
            </Button>
          </div>
        </div>
      </div>
      <FormField
        label="Password"
        name="password"
        type="password"
        placeholder="Min 6 characters"
        error={form.formState.errors.password?.message}
        disabled={isLoading}
        register={form.register}
        required
      />
    </FormWrapper>
  );
}

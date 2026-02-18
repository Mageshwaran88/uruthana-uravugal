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
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
      otp: "",
    },
  });

  async function onSendOtp() {
    const email = form.getValues("email");
    const mobile = form.getValues("mobile");
    if (!email || !mobile) {
      toast.error("Fill email and mobile first");
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
    try {
      setIsLoading(true);
      await registerUser({
        name: values.name,
        email: values.email,
        mobile: values.mobile,
        password: values.password,
        otp: values.otp || undefined,
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
      subtitle="Sign up with email and mobile; verify with OTP"
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
        label="Name"
        name="name"
        placeholder="Enter your name"
        error={form.formState.errors.name?.message}
        disabled={isLoading}
        register={form.register}
        required
      />
      <FormField
        label="Email"
        name="email"
        type="email"
        placeholder="Enter your email"
        error={form.formState.errors.email?.message}
        disabled={isLoading}
        register={form.register}
        required
      />
      <FormField
        label="Mobile"
        name="mobile"
        type="tel"
        placeholder="+91 9876543210"
        error={form.formState.errors.mobile?.message}
        disabled={isLoading}
        register={form.register}
        required
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

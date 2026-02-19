"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginType } from "@/types/auth";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { FormWrapper, FormField } from "@/components/forms";

export default function Login() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginType) {
    try {
      setIsLoading(true);
      await login(values.identifier.trim(), values.password);
      toast.success("Login successful!");
    } catch (error: unknown) {
      toast.error((error as Error).message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <FormWrapper
      title="Welcome Back"
      subtitle="Sign in with your email or mobile number"
      onSubmit={form.handleSubmit(onSubmit)}
      submitLabel="Sign In"
      isLoading={isLoading}
      footer={
        <>
          <div className="flex flex-col gap-2 text-center">
            <Link
              href="/forgot-password"
              className="text-primary hover:underline text-sm"
            >
              Forgot password?
            </Link>
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </>
      }
    >
      <FormField
        label="Email or mobile number"
        name="identifier"
        type="text"
        placeholder="you@example.com or 9876543210"
        error={form.formState.errors.identifier?.message}
        disabled={isLoading}
        register={form.register}
        required
      />
      <FormField
        label="Password"
        name="password"
        type="password"
        placeholder="Enter your password"
        error={form.formState.errors.password?.message}
        disabled={isLoading}
        register={form.register}
        required
      />
    </FormWrapper>
  );
}

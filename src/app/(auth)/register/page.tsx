"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterType } from "@/types/auth";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { FormWrapper, FormField } from "@/components/forms";

export default function Register() {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<RegisterType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: RegisterType) {
    try {
      setIsLoading(true);
      await register(values.name, values.email, values.password);
      toast.success("Account created successfully!");
    } catch (error: any) {
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <FormWrapper
      title="Create Account"
      subtitle="Sign up to get started"
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

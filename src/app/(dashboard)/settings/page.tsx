"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authApi } from "@/lib/api/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms";
import { toast } from "sonner";
import { Shield, KeyRound } from "lucide-react";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Required"),
    newPassword: z.string().min(6, "At least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordType = z.infer<typeof changePasswordSchema>;

export default function SettingsPage() {
  const [isChanging, setIsChanging] = useState(false);
  const form = useForm<ChangePasswordType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onChangePassword(values: ChangePasswordType) {
    try {
      setIsChanging(true);
      await authApi.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success("Password changed. Please sign in again.");
      form.reset();
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (e) {
      toast.error((e as Error).message || "Failed to change password");
    } finally {
      setIsChanging(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage your account security
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium flex items-center gap-2 mb-3">
                <KeyRound className="h-4 w-4" />
                Change password
              </h3>
              <form
                onSubmit={form.handleSubmit(onChangePassword)}
                className="space-y-4 max-w-md"
              >
                <FormField
                  label="Current password"
                  name="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  error={form.formState.errors.currentPassword?.message}
                  disabled={isChanging}
                  register={form.register}
                  required
                />
                <FormField
                  label="New password"
                  name="newPassword"
                  type="password"
                  placeholder="Min 6 characters"
                  error={form.formState.errors.newPassword?.message}
                  disabled={isChanging}
                  register={form.register}
                  required
                />
                <FormField
                  label="Confirm new password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  error={form.formState.errors.confirmPassword?.message}
                  disabled={isChanging}
                  register={form.register}
                  required
                />
                <Button type="submit" disabled={isChanging}>
                  {isChanging ? "Updating..." : "Change password"}
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

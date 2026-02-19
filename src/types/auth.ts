import { z } from "zod";

export type UserRole = "user" | "admin";

export const loginSchema = z.object({
  identifier: z.string().min(1, "Enter email or mobile number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginType = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().email("Enter a valid email"),
  otp: z.string().length(6, "Enter the 6-digit OTP"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RegisterType = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordWithOtpSchema = z.object({
  identifier: z.string().min(1),
  otp: z.string().length(6),
  newPassword: z.string().min(6),
});

export type ResetPasswordWithOtpType = z.infer<typeof resetPasswordWithOtpSchema>;

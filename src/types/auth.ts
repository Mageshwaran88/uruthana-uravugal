import { z } from "zod";

export type UserRole = "user" | "admin";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginType = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  mobile: z.string().min(10, "Enter a valid mobile number"),
  password: z.string().min(6),
  otp: z.string().length(6, "Enter the 6-digit OTP"),
});

export type RegisterType = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z
  .object({
    email: z.string().email().optional(),
    mobile: z.string().min(10).optional(),
  })
  .refine((d) => d.email || d.mobile, { message: "Provide email or mobile" });

export type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordWithOtpSchema = z.object({
  identifier: z.string().min(1),
  otp: z.string().length(6),
  newPassword: z.string().min(6),
});

export type ResetPasswordWithOtpType = z.infer<typeof resetPasswordWithOtpSchema>;

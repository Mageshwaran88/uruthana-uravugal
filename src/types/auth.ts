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
  password: z.string().min(6),
});

export type RegisterType = z.infer<typeof registerSchema>;

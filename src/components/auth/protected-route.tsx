"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import type { UserRole } from "@/types/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Routes are accessible only when user has one of these roles. Omit to allow any authenticated user. */
  allowedRoles?: UserRole[];
}

/**
 * Protects routes by requiring a valid auth token. Uses router.replace() so that
 * after redirect to login, browser back does not return to the protected page.
 * Optionally restrict by allowedRoles (user | admin).
 */
export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const redirected = useRef(false);

  useEffect(() => {
    if (isLoading) return;

    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

    if (!token || !isAuthenticated) {
      if (!redirected.current) {
        redirected.current = true;
        router.replace("/login");
      }
      return;
    }

    if (allowedRoles && allowedRoles.length > 0 && user?.role) {
      if (!allowedRoles.includes(user.role)) {
        if (!redirected.current) {
          redirected.current = true;
          // Redirect to dashboard (or first allowed route) when role has no access
          router.replace("/dashboard");
        }
        return;
      }
    }

    redirected.current = false;
  }, [isAuthenticated, isLoading, user?.role, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && allowedRoles.length > 0 && user?.role && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}

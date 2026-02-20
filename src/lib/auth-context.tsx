"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAPI, registerAPI, registerWithPhoneAPI, logoutAPI, refreshTokenAPI, meAPI } from "./auth-api";
import type { User } from "./auth-api";
export type { User } from "./auth-api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (params: { email: string; otp: string; password: string; username?: string; mobile?: string }) => Promise<void>;
  registerWithPhone: (params: { firebaseIdToken: string; password: string }) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem("auth_token");
      let me = token ? await meAPI() : null;
      if (!me && token) {
        const refreshed = await refreshTokenAPI();
        if (refreshed.success && refreshed.token && refreshed.user) {
          localStorage.setItem("auth_token", refreshed.token);
          localStorage.setItem("user_data", JSON.stringify(refreshed.user));
          document.cookie = `auth_token=${refreshed.token}; path=/; max-age=900; SameSite=Lax`;
          setUser(refreshed.user);
          return;
        }
      }
      if (!me && !token) {
        const refreshed = await refreshTokenAPI();
        if (refreshed.success && refreshed.token && refreshed.user) {
          localStorage.setItem("auth_token", refreshed.token);
          localStorage.setItem("user_data", JSON.stringify(refreshed.user));
          document.cookie = `auth_token=${refreshed.token}; path=/; max-age=900; SameSite=Lax`;
          setUser(refreshed.user);
          return;
        }
      }
      if (me) {
        const stored = localStorage.getItem("user_data");
        const parsed = stored ? JSON.parse(stored) : {};
        setUser({ ...parsed, ...me });
        if (token) {
          document.cookie = `auth_token=${token}; path=/; max-age=900; SameSite=Lax`;
        }
      } else {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");
        document.cookie = "auth_token=; path=/; max-age=0";
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    try {
      const response = await loginAPI(identifier, password);

      if (!response.success || !response.user || !response.token) {
        throw new Error(response.error || "Login failed. Please try again.");
      }

      // Store in localStorage (in production, use httpOnly cookies)
      localStorage.setItem("auth_token", response.token);
      localStorage.setItem("user_data", JSON.stringify(response.user));

      // Set cookie for middleware
      document.cookie = `auth_token=${response.token}; path=/; max-age=86400; SameSite=Lax`;

      setUser(response.user);
      router.replace("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }, [router]);

  const register = useCallback(
    async (params: { email: string; otp: string; password: string; username?: string; mobile?: string }) => {
      try {
        const response = await registerAPI(params);
        if (!response.success || !response.user || !response.token) {
          throw new Error(
            response.error || "Registration failed. Please try again."
          );
        }
        localStorage.setItem("auth_token", response.token);
        localStorage.setItem("user_data", JSON.stringify(response.user));
        document.cookie = `auth_token=${response.token}; path=/; max-age=86400; SameSite=Lax`;
        setUser(response.user);
        router.replace("/dashboard");
      } catch (error) {
        console.error("Registration failed:", error);
        throw error;
      }
    },
    [router]
  );

  const registerWithPhone = useCallback(
    async (params: { firebaseIdToken: string; password: string }) => {
      try {
        const response = await registerWithPhoneAPI(params);
        if (!response.success || !response.user || !response.token) {
          throw new Error(
            response.error || "Registration failed. Please try again."
          );
        }
        localStorage.setItem("auth_token", response.token);
        localStorage.setItem("user_data", JSON.stringify(response.user));
        document.cookie = `auth_token=${response.token}; path=/; max-age=86400; SameSite=Lax`;
        setUser(response.user);
        router.replace("/dashboard");
      } catch (error) {
        console.error("Registration failed:", error);
        throw error;
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    try {
      await logoutAPI();
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      document.cookie = "auth_token=; path=/; max-age=0";
      setUser(null);
      router.replace("/login");
    }
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        registerWithPhone,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

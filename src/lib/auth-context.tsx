"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAPI, registerAPI } from "./auth-api";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
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
      // Check localStorage for auth token
      const token = localStorage.getItem("auth_token");
      const userData = localStorage.getItem("user_data");

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        // Ensure cookie is set for middleware
        if (typeof document !== "undefined") {
          document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      // Call mock API with random responses
      const response = await loginAPI(email, password);

      if (!response.success || !response.user || !response.token) {
        throw new Error(response.error || "Login failed. Please try again.");
      }

      // Store in localStorage (in production, use httpOnly cookies)
      localStorage.setItem("auth_token", response.token);
      localStorage.setItem("user_data", JSON.stringify(response.user));

      // Set cookie for middleware
      document.cookie = `auth_token=${response.token}; path=/; max-age=86400; SameSite=Lax`;

      setUser(response.user);
      router.push("/admin");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }, [router]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      // Call mock API with random responses
      const response = await registerAPI(name, email, password);

      if (!response.success || !response.user || !response.token) {
        throw new Error(response.error || "Registration failed. Please try again.");
      }

      // Store in localStorage (in production, use httpOnly cookies)
      localStorage.setItem("auth_token", response.token);
      localStorage.setItem("user_data", JSON.stringify(response.user));

      // Set cookie for middleware
      document.cookie = `auth_token=${response.token}; path=/; max-age=86400; SameSite=Lax`;

      setUser(response.user);
      router.push("/admin");
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    // Remove cookie
    document.cookie = "auth_token=; path=/; max-age=0";
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
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

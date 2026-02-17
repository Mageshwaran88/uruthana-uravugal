"use client";

import Sidebar from "@/components/common/sidebar";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { usePathname } from "next/navigation";
import type { UserRole } from "@/types/auth";

const routeRoles: Record<string, UserRole[]> = {
  "/admin": ["admin"],
  "/user": ["user"],
  "/dashboard": [], // any authenticated
};

function getAllowedRoles(pathname: string): UserRole[] | undefined {
  if (pathname.startsWith("/admin")) return routeRoles["/admin"];
  if (pathname.startsWith("/user")) return routeRoles["/user"];
  if (pathname.startsWith("/dashboard")) return routeRoles["/dashboard"];
  return [];
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const allowedRoles = getAllowedRoles(pathname);
  const roles = allowedRoles && allowedRoles.length > 0 ? allowedRoles : undefined;

  return (
    <ProtectedRoute allowedRoles={roles}>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Shield,
  LogOut,
  Menu,
  X,
  PiggyBank,
  UserCircle,
  Settings,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useMediaQuery } from "@/lib/use-media-query";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/auth";

const allNavItems: Array<{
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles: UserRole[];
}> = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["user", "admin"] },
  { href: "/savings", label: "My Savings", icon: PiggyBank, roles: ["user", "admin"] },
  { href: "/profile", label: "Profile", icon: UserCircle, roles: ["user", "admin"] },
  { href: "/settings", label: "Settings", icon: Settings, roles: ["user", "admin"] },
  { href: "/user", label: "User", icon: Users, roles: ["user"] },
  { href: "/admin", label: "Admin", icon: Shield, roles: ["admin"] },
  { href: "/admin/users", label: "Admin Users", icon: Users, roles: ["admin"] },
  { href: "/admin/savings", label: "Admin Savings", icon: PiggyBank, roles: ["admin"] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const navItems = allNavItems.filter((item) => user?.role && item.roles.includes(user.role));  
  // On desktop always show sidebar width; on mobile animate open/close
  const sidebarWidth = isDesktop ? "16rem" : isMobileOpen ? "100%" : "0%";

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border p-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Uruthana Uravugal</h2>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-md hover:bg-accent"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarWidth }}
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen lg:h-auto z-40 bg-card border-r border-border overflow-hidden",
          "lg:block shrink-0",
          !isDesktop && (isMobileOpen ? "block" : "hidden")
        )}
      >
        <div className="h-full flex flex-col p-6">
          {/* Logo */}
          <div className="mb-8 pt-16 lg:pt-0">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Uruthana Uravugal
            </h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="mt-auto pt-6 border-t border-border">
            {user && (
              <div className="mb-4 px-4 py-2">
                <p className="text-sm font-medium text-foreground">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground">{user.email ?? user.mobile ?? "—"}</p>
              </div>
            )}
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}
    </>
  );
}

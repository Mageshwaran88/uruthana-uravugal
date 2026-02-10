"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    // Update page title
    document.title = "404 - Page Not Found | Uruthana Uravugal";
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-background to-muted overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-2xl space-y-8 text-center relative z-10">
        {/* 404 Number */}
        <div className="space-y-4">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            404
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-primary/50 mx-auto rounded-full"></div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or the URL might be incorrect.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link href="/">
            <Button size="lg" className="gap-2 w-full sm:w-auto">
              <Home size={20} />
              Go Home
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            onClick={() => window.history.back()}
            className="gap-2 w-full sm:w-auto"
          >
            <ArrowLeft size={20} />
            Go Back
          </Button>
        </div>

        {/* Quick Links */}
        <div className="pt-8 border-t">
          <p className="text-sm text-muted-foreground mb-4">Quick Links:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/login"
              className="text-sm text-primary hover:underline transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-sm text-primary hover:underline transition-colors"
            >
              Register
            </Link>
            <Link
              href="/test"
              className="text-sm text-primary hover:underline transition-colors"
            >
              Test Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

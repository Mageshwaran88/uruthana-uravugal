"use client";

import { useQuery } from "@tanstack/react-query";
import { usersApi, getAvatarUrl } from "@/lib/api/users";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle, Mail, Phone, Edit } from "lucide-react";

export default function ProfilePage() {
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile-me"],
    queryFn: () => usersApi.me(),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <div className="h-48 rounded-lg bg-muted animate-pulse" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-destructive">Failed to load profile.</p>
      </div>
    );
  }

  const avatarUrl = getAvatarUrl(profile.avatarUrl);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Link href="/profile/edit">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit profile
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="h-5 w-5" />
            Personal information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full overflow-hidden bg-muted shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <UserCircle className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>
            <div>
              <p className="text-2xl font-semibold">{profile.name}</p>
              <p className="text-muted-foreground text-sm">
                Update your photo and details in Edit profile
              </p>
            </div>
          </div>
          <dl className="grid gap-3">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Email:</span>
              <span>{profile.email ?? "—"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Mobile:</span>
              <span>{profile.mobile ?? "—"}</span>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}

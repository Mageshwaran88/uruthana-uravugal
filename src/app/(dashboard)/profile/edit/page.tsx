"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usersApi, getAvatarUrl } from "@/lib/api/users";
import { useAuth } from "@/lib/auth-context";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/forms";
import { UserCircle, Upload } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  mobile: z.string().optional(),
});

type ProfileFormType = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
  const queryClient = useQueryClient();
  const { user, checkAuth } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile-me"],
    queryFn: () => usersApi.me(),
  });

  const form = useForm<ProfileFormType>({
    resolver: zodResolver(profileSchema),
    values: profile
      ? {
          name: profile.name,
          email: profile.email ?? "",
          mobile: profile.mobile ?? "",
        }
      : undefined,
  });

  const updateMutation = useMutation({
    mutationFn: (body: ProfileFormType) =>
      usersApi.updateMe({
        name: body.name,
        email: body.email || undefined,
        mobile: body.mobile || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile-me"] });
      checkAuth();
      toast.success("Profile updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => usersApi.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile-me"] });
      checkAuth();
      setAvatarFile(null);
      setAvatarPreview(null);
      toast.success("Photo updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  function onSubmit(values: ProfileFormType) {
    updateMutation.mutate(values);
  }

  function onUploadClick() {
    if (avatarFile) {
      uploadMutation.mutate(avatarFile);
    } else {
      fileInputRef.current?.click();
    }
  }

  if (isLoading || !profile) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Edit profile</h1>
        <div className="h-48 rounded-lg bg-muted animate-pulse" />
      </div>
    );
  }

  const currentAvatarUrl = avatarPreview || getAvatarUrl(profile.avatarUrl);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile photo</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <div className="h-24 w-24 rounded-full overflow-hidden bg-muted shrink-0">
            {currentAvatarUrl ? (
              <img
                src={currentAvatarUrl}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <UserCircle className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onSelectFile}
          />
          <Button
            type="button"
            variant="outline"
            onClick={onUploadClick}
            disabled={uploadMutation.isPending}
          >
            <Upload className="mr-2 h-4 w-4" />
            {avatarFile ? "Save photo" : "Change photo"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal information</CardTitle>
          <p className="text-sm text-muted-foreground">
            Update your name and contact details
          </p>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 max-w-md"
          >
            <FormField
              label="Name"
              name="name"
              placeholder="Your name"
              error={form.formState.errors.name?.message}
              disabled={updateMutation.isPending}
              register={form.register}
              required
            />
            <FormField
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              error={form.formState.errors.email?.message}
              disabled={updateMutation.isPending}
              register={form.register}
            />
            <FormField
              label="Mobile"
              name="mobile"
              type="tel"
              placeholder="+91 9876543210"
              error={form.formState.errors.mobile?.message}
              disabled={updateMutation.isPending}
              register={form.register}
            />
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// components/account/AccountSettingsClient.tsx
"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Minimum 8 characters").regex(/[A-Z]/, "Must include uppercase").regex(/[0-9]/, "Must include a number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

interface Props { user: { id: string; name: string; email: string } }

export default function AccountSettingsClient({ user }: Props) {
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [profilePending, startProfileTransition] = useTransition();
  const [passwordPending, startPasswordTransition] = useTransition();

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name },
  });

  const passwordForm = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  const onProfileSubmit = (data: ProfileForm) => {
    startProfileTransition(async () => {
      // Phase 4: wire to updateProfileAction server action
      await new Promise((r) => setTimeout(r, 600));
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    });
  };

  const onPasswordSubmit = (data: PasswordForm) => {
    startPasswordTransition(async () => {
      // Phase 4: wire to changePasswordAction server action
      await new Promise((r) => setTimeout(r, 600));
      setPasswordSaved(true);
      passwordForm.reset();
      setTimeout(() => setPasswordSaved(false), 3000);
    });
  };

  const sectionClass = "rounded-xl border p-6 space-y-5";
  const sectionStyle = { borderColor: "var(--color-border)", background: "var(--color-card)" };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Account settings</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
          Manage your profile and security preferences
        </p>
      </div>

      {/* Profile */}
      <div className={sectionClass} style={sectionStyle}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full flex items-center justify-center"
            style={{ background: "color-mix(in srgb, var(--color-cyan-500) 15%, transparent)", color: "var(--color-cyan-500)" }}>
            <User className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold">Profile information</h2>
            <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>Update your name and email address</p>
          </div>
        </div>
        <Separator />
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4 max-w-md">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Full name</label>
            <Input {...profileForm.register("name")} />
            {profileForm.formState.errors.name && (
              <p className="text-xs text-red-500">{profileForm.formState.errors.name.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Email address</label>
            <Input value={user.email} disabled className="opacity-60 cursor-not-allowed" />
            <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
              Email cannot be changed. Contact support if needed.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={profilePending}>
              {profilePending ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : "Save changes"}
            </Button>
            {profileSaved && (
              <span className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" /> Saved
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Password */}
      <div className={sectionClass} style={sectionStyle}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full flex items-center justify-center"
            style={{ background: "color-mix(in srgb, var(--color-navy-600) 15%, transparent)", color: "var(--color-navy-600)" }}>
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold">Change password</h2>
            <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
              Use a strong password you don&apos;t use elsewhere
            </p>
          </div>
        </div>
        <Separator />
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4 max-w-md">
          {(["currentPassword", "newPassword", "confirmPassword"] as const).map((field) => {
            const labels = { currentPassword: "Current password", newPassword: "New password", confirmPassword: "Confirm new password" };
            return (
              <div key={field} className="space-y-1.5">
                <label className="text-sm font-medium">{labels[field]}</label>
                <Input type="password" autoComplete={field === "currentPassword" ? "current-password" : "new-password"}
                  {...passwordForm.register(field)} />
                {passwordForm.formState.errors[field] && (
                  <p className="text-xs text-red-500">{passwordForm.formState.errors[field]?.message}</p>
                )}
              </div>
            );
          })}
          <div className="flex items-center gap-3">
            <Button type="submit" variant="navy" disabled={passwordPending}>
              {passwordPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Updating…</> : "Update password"}
            </Button>
            {passwordSaved && (
              <span className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" /> Password updated
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

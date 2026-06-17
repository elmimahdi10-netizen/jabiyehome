"use client";
import { useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordSchema } from "@/lib/validations/auth.schema";
import { resetPasswordAction } from "@/lib/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold">Invalid reset link</h2>
        <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
          This password reset link is invalid or has expired.
        </p>
        <Button asChild><Link href="/forgot-password">Request a new link</Link></Button>
      </div>
    );
  }

  if (result?.success) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto" />
        <h2 className="text-xl font-bold">Password updated</h2>
        <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
          Your password has been reset successfully.
        </p>
        <Button asChild><Link href="/login">Sign in</Link></Button>
      </div>
    );
  }

  const onSubmit = (data: ResetPasswordSchema) => {
    startTransition(async () => {
      const res = await resetPasswordAction({ ...data, token });
      setResult(res);
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Set a new password</h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-muted-foreground)" }}>
          Choose a strong password for your account.
        </p>
      </div>

      {result?.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {result.error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register("token")} value={token} />

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium">New password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--color-muted-foreground)" }} />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Min 8 characters"
              className="pl-9 pr-10"
              {...register("password")}
            />
            <button type="button" onClick={() => setShowPassword(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-muted-foreground)" }}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm new password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--color-muted-foreground)" }} />
            <Input id="confirmPassword" type={showPassword ? "text" : "password"} autoComplete="new-password"
              placeholder="Repeat your password" className="pl-9" {...register("confirmPassword")} />
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Updating…</> : "Update password"}
        </Button>
      </form>
    </div>
  );
}

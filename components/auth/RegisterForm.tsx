"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, Shield, Loader2, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { registerSchema, type RegisterSchema } from "@/lib/validations/auth.schema";
import { registerAction } from "@/lib/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: { acceptTerms: false },
  });

  const password = watch("password", "");
  const passwordStrength = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const strengthCount = passwordStrength.filter(Boolean).length;
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strengthCount];
  const strengthColor = ["", "bg-red-500", "bg-amber-500", "bg-yellow-400", "bg-green-500"][strengthCount];

  const onSubmit = (data: RegisterSchema) => {
    setServerError(null);
    startTransition(async () => {
      const result = await registerAction(data);
      if (!result.success) {
        setServerError(result.error);
        return;
      }
      // Auto sign-in
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      setSuccess(true);
      setTimeout(() => router.push("/account"), 1500);
    });
  };

  if (success) {
    return (
      <div className="text-center space-y-4 py-8">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
        <h2 className="text-xl font-bold">Account created!</h2>
        <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
          Taking you to your dashboard…
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display, sans-serif)" }}>
          Create your account
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-muted-foreground)" }}>
          Join 150,000+ homeowners who trust Jabiyehome
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        size="lg"
        onClick={() => signIn("google", { callbackUrl: "/account" })}
        disabled={isPending}
      >
        <svg className="h-4 w-4 mr-2 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Sign up with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" style={{ borderColor: "var(--color-border)" }} />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 text-xs uppercase tracking-wide" style={{ background: "var(--color-background)", color: "var(--color-muted-foreground)" }}>
            or register with email
          </span>
        </div>
      </div>

      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="firstName" className="text-sm font-medium">First name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--color-muted-foreground)" }} />
              <Input id="firstName" placeholder="Alex" className="pl-9" {...register("firstName")} />
            </div>
            {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-1.5">
            <label htmlFor="lastName" className="text-sm font-medium">Last name</label>
            <Input id="lastName" placeholder="Smith" {...register("lastName")} />
            {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--color-muted-foreground)" }} />
            <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" className="pl-9" {...register("email")} />
          </div>
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
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
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Password strength */}
          {password.length > 0 && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${i < strengthCount ? strengthColor : "bg-gray-200 dark:bg-gray-700"}`}
                  />
                ))}
              </div>
              <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                Strength: {strengthLabel}
              </p>
            </div>
          )}
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <div className="flex items-start gap-2.5">
          <input
            id="acceptTerms"
            type="checkbox"
            className="h-4 w-4 mt-0.5 rounded accent-cyan-500"
            {...register("acceptTerms")}
          />
          <label htmlFor="acceptTerms" className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
            I agree to Jabiyehome&apos;s{" "}
            <Link href="/terms" className="hover:underline" style={{ color: "var(--color-cyan-500)" }}>Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy" className="hover:underline" style={{ color: "var(--color-cyan-500)" }}>Privacy Policy</Link>
          </label>
        </div>
        {errors.acceptTerms && <p className="text-xs text-red-500">{errors.acceptTerms.message}</p>}

        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Creating account…</>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <p className="text-center text-sm" style={{ color: "var(--color-muted-foreground)" }}>
        Already have an account?{" "}
        <Link href="/login" className="font-medium hover:underline" style={{ color: "var(--color-cyan-500)" }}>
          Sign in
        </Link>
      </p>

      <div className="flex items-center justify-center gap-1.5 text-xs" style={{ color: "var(--color-muted-foreground)" }}>
        <Shield className="h-3.5 w-3.5 text-green-500" />
        Secured with 256-bit SSL encryption
      </div>
    </div>
  );
}

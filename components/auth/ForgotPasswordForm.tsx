"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordSchema } from "@/lib/validations/auth.schema";
import { forgotPasswordAction } from "@/lib/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, getValues, formState: { errors } } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordSchema) => {
    startTransition(async () => {
      await forgotPasswordAction(data);
      setSubmitted(true);
    });
  };

  if (submitted) {
    return (
      <div className="text-center space-y-4">
        <div className="h-14 w-14 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-7 w-7 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-xl font-bold">Check your inbox</h2>
        <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
          If <strong>{getValues("email")}</strong> is registered, you&apos;ll receive a reset link within a few minutes.
        </p>
        <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
          The link expires in 1 hour. Check your spam folder if you don&apos;t see it.
        </p>
        <Button variant="outline" asChild className="mt-2">
          <Link href="/login"><ArrowLeft className="h-4 w-4" /> Back to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: "color-mix(in srgb, var(--color-cyan-500) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--color-cyan-500) 20%, transparent)" }}>
          <Mail className="h-7 w-7" style={{ color: "var(--color-cyan-500)" }} />
        </div>
        <h1 className="text-2xl font-bold">Forgot your password?</h1>
        <p className="text-sm mt-2 max-w-xs mx-auto" style={{ color: "var(--color-muted-foreground)" }}>
          Enter your email and we&apos;ll send you a secure link to reset it.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--color-muted-foreground)" }} />
            <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" className="pl-9" {...register("email")} />
          </div>
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : "Send reset link"}
        </Button>
      </form>

      <p className="text-center text-sm" style={{ color: "var(--color-muted-foreground)" }}>
        <Link href="/login" className="font-medium hover:underline flex items-center justify-center gap-1" style={{ color: "var(--color-cyan-500)" }}>
          <ArrowLeft className="h-3 w-3" /> Back to sign in
        </Link>
      </p>
    </div>
  );
}

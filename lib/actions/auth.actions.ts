// lib/actions/auth.actions.ts — Server Actions for all auth flows
"use server";

import { hash } from "bcryptjs";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import prisma from "@/lib/prisma";
import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { randomBytes } from "crypto";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validations/auth.schema";
import type { LoginSchema, RegisterSchema, ForgotPasswordSchema, ResetPasswordSchema } from "@/lib/validations/auth.schema";

export type ActionResult = { success: true; message?: string } | { success: false; error: string };

// ─── Register ─────────────────────────────────────────────────────────────────

export async function registerAction(data: RegisterSchema): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const { firstName, lastName, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: "An account with this email already exists." };
  }

  const passwordHash = await hash(password, 12);

  await prisma.user.create({
    data: {
      email,
      name: `${firstName} ${lastName}`,
      passwordHash,
      role: "CUSTOMER",
    },
  });

  // Auto sign-in after registration
  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch {
    // If sign-in fails, user can sign in manually
  }

  return { success: true, message: "Account created successfully." };
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function loginAction(data: LoginSchema, callbackUrl?: string): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Invalid email or password." };
        default:
          return { success: false, error: "Something went wrong. Please try again." };
      }
    }
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}

// ─── Forgot Password ──────────────────────────────────────────────────────────

export async function forgotPasswordAction(data: ForgotPasswordSchema): Promise<ActionResult> {
  // Rate limit: 10 requests per 15 minutes per email
  const limitResult = rateLimit(`forgot-password:${data.email ?? "unknown"}`, RATE_LIMITS.auth.limit, RATE_LIMITS.auth.windowMs);
  if (!limitResult.allowed) {
    return { success: false, error: "Too many requests. Please wait 15 minutes before trying again." };
  }
  const parsed = forgotPasswordSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid email address." };
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  // Always return success to prevent email enumeration
  if (!user) return { success: true };

  // Invalidate previous tokens
  await prisma.passwordResetToken.updateMany({
    where: { userId: user.id, usedAt: null },
    data: { usedAt: new Date() },
  });

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordResetToken.create({
    data: { userId: user.id, token, expiresAt },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${token}`;

  try {
    const { sendPasswordReset } = await import("@/lib/services/email.service");
    await sendPasswordReset(user.email!, resetUrl);
  } catch {
    // Non-fatal: token is stored, user can request again
  }

  return { success: true };
}

// ─── Reset Password ───────────────────────────────────────────────────────────

export async function resetPasswordAction(data: ResetPasswordSchema): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }
  const { token, password } = parsed.data;

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return { success: false, error: "This reset link has expired or already been used. Please request a new one." };
  }

  const passwordHash = await hash(password, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return { success: true, message: "Password updated. You can now sign in." };
}

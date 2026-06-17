// lib/actions/newsletter.actions.ts — Newsletter subscription
"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

const schema = z.object({ email: z.string().email("Please enter a valid email address.") });

export async function subscribeToNewsletter(
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const parsed = schema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  const { email } = parsed.data;
  const session = await auth().catch(() => null);

  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {
        unsubscribedAt: null,
        ...(session?.user?.id ? { userId: session.user.id } : {}),
      },
      create: {
        email,
        ...(session?.user?.id ? { userId: session.user.id } : {}),
      },
    });
    return { success: true, message: "You're subscribed! Expect security tips and product updates." };
  } catch {
    return { success: false, message: "Something went wrong. Please try again." };
  }
}

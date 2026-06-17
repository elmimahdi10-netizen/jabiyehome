// app/(store)/account/settings/page.tsx
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import AccountSettingsClient from "@/components/account/AccountSettingsClient";

export const metadata: Metadata = { title: "Account Settings" };
export const dynamic = "force-dynamic";

export default async function AccountSettingsPage() {
  const session = await auth();
  return (
    <AccountSettingsClient
      user={{ id: session!.user.id, name: session!.user.name ?? "", email: session!.user.email ?? "" }}
    />
  );
}

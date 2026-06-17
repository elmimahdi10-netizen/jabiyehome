// app/(store)/account/addresses/page.tsx — Saved address management
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "My Addresses" };
export const dynamic = "force-dynamic";

export default async function AddressesPage() {
  const session = await auth();

  const addresses = await prisma.address.findMany({
    where: { userId: session!.user.id },
    orderBy: [{ isDefault: "desc" }, { id: "asc" }],
  }).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Saved addresses</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
            Addresses are automatically saved when you place an order.
          </p>
        </div>
        <Button disabled variant="outline" title="Manual address entry coming soon">
          <Plus className="h-4 w-4" /> Add address
        </Button>
      </div>

      {(addresses as any[]).length === 0 ? (
        <div className="rounded-xl border py-16 text-center"
          style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
          <MapPin className="h-12 w-12 mx-auto mb-4" style={{ color: "var(--color-muted-foreground)", opacity: 0.3 }} />
          <h2 className="font-semibold mb-2">No saved addresses</h2>
          <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
            Addresses are saved automatically when you checkout.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(addresses as any[]).map((address) => (
            <div key={address.id}
              className="rounded-xl border p-5 space-y-2 relative"
              style={{
                borderColor: address.isDefault ? "var(--color-cyan-500)" : "var(--color-border)",
                background: "var(--color-card)",
              }}>
              {address.isDefault && (
                <span className="absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "color-mix(in srgb, var(--color-cyan-500) 15%, transparent)", color: "var(--color-cyan-500)" }}>
                  Default
                </span>
              )}
              {address.label && (
                <p className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--color-muted-foreground)" }}>
                  {address.label}
                </p>
              )}
              <address className="not-italic text-sm leading-relaxed">
                <p className="font-semibold">{address.firstName} {address.lastName}</p>
                {address.company && <p>{address.company}</p>}
                <p style={{ color: "var(--color-muted-foreground)" }}>
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ""}
                </p>
                <p style={{ color: "var(--color-muted-foreground)" }}>
                  {address.city}{address.state ? `, ${address.state}` : ""} {address.postalCode}
                </p>
                <p style={{ color: "var(--color-muted-foreground)" }}>{address.country}</p>
                {address.phone && (
                  <p className="mt-1 text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                    {address.phone}
                  </p>
                )}
              </address>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

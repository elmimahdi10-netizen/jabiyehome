// app/admin/customers/page.tsx — Customer management list
import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/utils/currency";
import { Users, ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Customers — Admin" };
export const dynamic = "force-dynamic";

interface Props { searchParams: Promise<{ q?: string; page?: string }> }

export default async function AdminCustomersPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = sp.q ?? "";
  const page = Math.max(1, parseInt(sp.page ?? "1"));
  const perPage = 25;

  const where: any = {
    role: "CUSTOMER",
    ...(q && { OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }] }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        orders: { where: { status: { in: ["PAYMENT_RECEIVED", "PROCESSING", "SHIPPED", "DELIVERED"] } }, select: { total: true } },
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>{total} customers</p>
        </div>
      </div>

      {/* Search */}
      <form>
        <input name="q" defaultValue={q} placeholder="Search by name or email…"
          className="h-10 px-4 rounded-lg border text-sm w-72 focus:outline-none focus:ring-2"
          style={{ borderColor: "var(--color-border)", background: "var(--color-card)", color: "var(--color-foreground)" }} />
      </form>

      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
        <table className="w-full text-sm" style={{ background: "var(--color-card)" }}>
          <thead className="border-b" style={{ borderColor: "var(--color-border)", background: "var(--color-muted)" }}>
            <tr>
              {["Customer", "Orders", "Lifetime value", "Joined", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--color-muted-foreground)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--color-border)" }}>
            {users.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12" style={{ color: "var(--color-muted-foreground)" }}>
                <Users className="h-8 w-8 mx-auto mb-2 opacity-30" /> No customers found
              </td></tr>
            ) : (
              (users as any[]).map((user) => {
                const ltv = user.orders.reduce((sum: number, o: any) => sum + Number(o.total), 0);
                return (
                  <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                          style={{ background: "color-mix(in srgb, var(--color-cyan-500) 15%, transparent)", color: "var(--color-cyan-500)" }}>
                          {user.name?.charAt(0) ?? user.email?.charAt(0) ?? "?"}
                        </div>
                        <div>
                          <p className="font-medium">{user.name ?? "No name"}</p>
                          <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{user._count.orders}</td>
                    <td className="px-4 py-3 font-semibold">{ltv > 0 ? formatPrice(ltv) : "—"}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: "var(--color-muted-foreground)" }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/customers/${user.id}`}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors inline-flex"
                        style={{ color: "var(--color-muted-foreground)" }}>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            {page > 1 && <Link href={`/admin/customers?page=${page - 1}&q=${q}`} className="px-3 py-1.5 rounded-lg border text-sm hover:bg-muted" style={{ borderColor: "var(--color-border)" }}>Previous</Link>}
            {page < totalPages && <Link href={`/admin/customers?page=${page + 1}&q=${q}`} className="px-3 py-1.5 rounded-lg border text-sm hover:bg-muted" style={{ borderColor: "var(--color-border)" }}>Next</Link>}
          </div>
        </div>
      )}
    </div>
  );
}

// app/admin/reviews/page.tsx — Review moderation queue
import type { Metadata } from "next";
import { getAllReviews } from "@/lib/services/review.service";
import AdminReviewsClient from "@/components/admin/AdminReviewsClient";

export const metadata: Metadata = { title: "Reviews — Admin" };
export const dynamic = "force-dynamic";

interface Props { searchParams: Promise<{ filter?: string; page?: string }> }

export default async function AdminReviewsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const filter = (sp.filter ?? "all") as "all" | "pending" | "approved";
  const page = parseInt(sp.page ?? "1");

  const { data, meta } = await getAllReviews(page, 25, filter).catch(() => ({
    data: [], meta: { total: 0, page: 1, perPage: 25, totalPages: 0 },
  }));

  return <AdminReviewsClient reviews={data} meta={meta} filter={filter} />;
}

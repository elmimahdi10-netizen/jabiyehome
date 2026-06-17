// app/(store)/search/page.tsx — Search results page (redirects to /products?q=)
import { redirect } from "next/navigation";

interface Props { searchParams: Promise<{ q?: string }> }

// Search is handled by /products?q= — this page exists purely so
// any bookmarked /search?q= URLs still work.
export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  redirect(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
}

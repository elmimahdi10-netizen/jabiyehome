"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface SortSelectProps {
  defaultValue?: string;
}

export default function SortSelect({ defaultValue = "newest" }: SortSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select
      defaultValue={defaultValue}
      onChange={handleChange}
      className="text-sm border border-(--color-border) bg-(--color-background) rounded-lg px-3 py-1.5 text-(--color-foreground) focus:outline-none focus:ring-2 focus:ring-(--color-ring)"
    >
      <option value="newest">Newest first</option>
      <option value="price_asc">Price: Low to high</option>
      <option value="price_desc">Price: High to low</option>
      <option value="rating">Highest rated</option>
      <option value="popular">Most popular</option>
    </select>
  );
}

// components/layout/SearchOverlay.tsx — Full-screen search with live suggestions
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, ArrowRight, Clock, TrendingUp, Loader2, Shield } from "lucide-react";
import { useUIStore } from "@/store/ui.store";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";

const TRENDING_SEARCHES = [
  "4K outdoor camera",
  "Wireless alarm system",
  "Smart door lock",
  "Motion sensor",
  "Security kit",
  "Smart thermostat",
];

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  imageUrl: string | null;
  category: string | null;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function SearchOverlay() {
  const { isSearchOpen, closeSearch, openSearch } = useUIStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const debouncedQuery = useDebounce(query, 280);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("sh_recent_searches") ?? "[]");
      setRecentSearches(stored.slice(0, 5));
    } catch { /* ignore */ }
  }, []);

  // Focus input when overlay opens
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
    }
  }, [isSearchOpen]);

  // ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        isSearchOpen ? closeSearch() : openSearch();
      }
      if (e.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isSearchOpen, closeSearch, openSearch]);

  // Live suggestions
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/v1/search?q=${encodeURIComponent(debouncedQuery)}&limit=6&mode=suggest`,
          { signal: controller.signal }
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data.results ?? []);
        }
      } catch { /* ignore aborts */ } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [debouncedQuery]);

  const saveRecentSearch = useCallback((term: string) => {
    try {
      const existing = JSON.parse(localStorage.getItem("sh_recent_searches") ?? "[]") as string[];
      const updated = [term, ...existing.filter((s) => s !== term)].slice(0, 5);
      localStorage.setItem("sh_recent_searches", JSON.stringify(updated));
      setRecentSearches(updated);
    } catch { /* ignore */ }
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const term = query.trim();
    if (!term) return;
    saveRecentSearch(term);
    closeSearch();
    router.push(`/products?q=${encodeURIComponent(term)}`);
  };

  const handleSuggestionClick = (term: string) => {
    saveRecentSearch(term);
    closeSearch();
    router.push(`/products?q=${encodeURIComponent(term)}`);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50"
          style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)" }}
          onClick={closeSearch}
        >
          <div className="max-w-2xl mx-auto px-4 mt-20" onClick={(e) => e.stopPropagation()}>
            {/* Search input */}
            <motion.div
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5"
                  style={{ color: "var(--color-muted-foreground)" }} />
                <Input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, categories, brands…"
                  className="pl-12 pr-14 h-14 text-base rounded-2xl shadow-2xl border-0"
                  style={{ background: "var(--color-card)" }}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" style={{ color: "var(--color-muted-foreground)" }} />}
                  {query && (
                    <button type="button" onClick={() => setQuery("")}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                      style={{ color: "var(--color-muted-foreground)" }}>
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  {!query && (
                    <kbd className="text-xs px-2 py-0.5 rounded font-mono border"
                      style={{ color: "var(--color-muted-foreground)", borderColor: "var(--color-border)", background: "var(--color-muted)" }}>
                      ESC
                    </kbd>
                  )}
                </div>
              </form>

              {/* Results panel */}
              <div className="mt-2 rounded-2xl border shadow-2xl overflow-hidden"
                style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}>
                {/* Live product suggestions */}
                {results.length > 0 && (
                  <div className="p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider px-2 mb-2"
                      style={{ color: "var(--color-muted-foreground)" }}>
                      Products
                    </p>
                    {results.map((result) => (
                      <Link key={result.id} href={`/products/${result.slug}`}
                        onClick={() => { saveRecentSearch(result.name); closeSearch(); }}
                        className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-muted transition-colors group">
                        <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0"
                          style={{ background: "var(--color-muted)" }}>
                          {result.imageUrl ? (
                            <Image src={result.imageUrl} alt={result.name} width={40} height={40}
                              className="object-cover w-full h-full" />
                          ) : (
                            <Shield className="h-5 w-5 m-2.5" style={{ color: "var(--color-muted-foreground)", opacity: 0.4 }} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate group-hover:text-green-500 transition-colors">
                            {result.name}
                          </p>
                          {result.category && (
                            <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                              {result.category}
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold">{formatPrice(result.salePrice ?? result.price)}</p>
                          {result.salePrice && (
                            <p className="text-xs line-through" style={{ color: "var(--color-muted-foreground)" }}>
                              {formatPrice(result.price)}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                    <button onClick={handleSearch}
                      className="w-full mt-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-muted"
                      style={{ color: "var(--color-green-600)" }}>
                      See all results for &ldquo;{query}&rdquo;
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Trending / recent (no query) */}
                {!query && (
                  <div className="p-4 space-y-5">
                    {recentSearches.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-2.5 flex items-center gap-1.5"
                          style={{ color: "var(--color-muted-foreground)" }}>
                          <Clock className="h-3.5 w-3.5" /> Recent
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((term) => (
                            <button key={term} onClick={() => handleSuggestionClick(term)}
                              className="text-sm px-3 py-1.5 rounded-full transition-colors hover:bg-accent"
                              style={{ background: "var(--color-muted)", color: "var(--color-foreground)" }}>
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2.5 flex items-center gap-1.5"
                        style={{ color: "var(--color-muted-foreground)" }}>
                        <TrendingUp className="h-3.5 w-3.5" /> Trending
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {TRENDING_SEARCHES.map((term) => (
                          <button key={term} onClick={() => handleSuggestionClick(term)}
                            className="text-sm px-3 py-1.5 rounded-full border transition-colors hover:border-green-500/40 hover:text-green-500"
                            style={{ borderColor: "var(--color-border)", color: "var(--color-foreground)" }}>
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* No results */}
                {query.length >= 2 && !loading && results.length === 0 && (
                  <div className="px-5 py-8 text-center">
                    <p className="font-medium">No products found for &ldquo;{query}&rdquo;</p>
                    <p className="text-sm mt-1" style={{ color: "var(--color-muted-foreground)" }}>
                      Try a different search term or browse our categories.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

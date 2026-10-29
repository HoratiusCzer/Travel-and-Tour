"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { categories, destinations, type Category } from "@/data/destinations";
import { cn } from "@/lib/cn";
import { DestinationCard } from "./DestinationCard";

export function DestinationExplorer() {
  const query = (useSearchParams().get("q") ?? "").trim().toLowerCase();
  const [category, setCategory] = useState<Category | "All">("All");

  const results = destinations.filter((d) => {
    const matchesCategory = category === "All" || d.category === category;
    const matchesQuery =
      !query || `${d.name} ${d.country} ${d.category} ${d.tagline}`.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  return (
    <>
      <div className="mb-8 flex flex-wrap justify-center gap-2" role="group" aria-label="Filter by category">
        {(["All", ...categories] as const).map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition",
              category === c
                ? "border-lagoon-600 bg-lagoon-600 text-white"
                : "border-lagoon-600/30 text-lagoon-700 hover:bg-lagoon-50 dark:border-lagoon-400/30 dark:text-lagoon-200 dark:hover:bg-lagoon-900",
            )}
          >
            {c}
          </button>
        ))}
      </div>
      {query && (
        <p className="mb-6 text-center text-sm text-ink-800/70 dark:text-lagoon-50/70">
          Showing {results.length} result{results.length === 1 ? "" : "s"} for “{query}”
        </p>
      )}
      {results.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((d) => (
            <DestinationCard key={d.slug} destination={d} />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-ink-800/70 dark:text-lagoon-50/70">
          No destinations match yet. Try a country, a vibe like “beach”, or clear the filter.
        </p>
      )}
    </>
  );
}

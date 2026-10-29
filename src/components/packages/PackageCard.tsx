import Link from "next/link";
import { getDestination } from "@/data/destinations";
import type { TourPackage } from "@/data/packages";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

export function PackageCard({ pkg }: { pkg: TourPackage }) {
  const destination = getDestination(pkg.destinationSlug);

  return (
    <article
      className={cn(
        "relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm dark:bg-ink-900",
        pkg.popular ? "border-saffron-500" : "border-lagoon-600/15 dark:border-white/10",
      )}
    >
      {pkg.popular && (
        <span className="absolute -top-3 right-5 rounded-full bg-saffron-500 px-3 py-1 text-xs font-semibold text-ink-950">
          Most loved
        </span>
      )}
      <p className="text-sm text-lagoon-700 dark:text-lagoon-200">
        {destination?.name}, {destination?.country}
      </p>
      <h3 className="mt-1 text-2xl font-semibold text-ink-900 dark:text-white">{pkg.title}</h3>
      <p className="mt-1 text-sm text-ink-800/70 dark:text-lagoon-50/70">
        {pkg.days} days · {pkg.groupSize}
      </p>
      <ul className="mt-5 space-y-2 text-sm">
        {pkg.perks.map((perk) => (
          <li key={perk} className="flex gap-2">
            <span aria-hidden className="text-lagoon-600 dark:text-lagoon-400">✓</span>
            {perk}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex items-end justify-between border-t border-lagoon-600/10 pt-5 dark:border-white/10">
        <div>
          <span className="text-xs uppercase tracking-wide text-ink-800/60 dark:text-lagoon-50/60">From</span>
          <p className="font-display text-3xl font-semibold text-ink-900 dark:text-white">
            {formatPrice(pkg.price)}
          </p>
          <span className="text-xs text-ink-800/60 dark:text-lagoon-50/60">per person</span>
        </div>
        <Link
          href={`/destinations/${pkg.destinationSlug}`}
          className="rounded-full bg-lagoon-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-lagoon-700"
        >
          View trip
        </Link>
      </div>
    </article>
  );
}

import Link from "next/link";
import { getDestination } from "@/data/destinations";
import type { TourPackage } from "@/data/packages";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { ItineraryButton } from "./ItineraryButton";

export function PackageCard({ pkg }: { pkg: TourPackage }) {
  const destination = getDestination(pkg.destinationSlug);

  return (
    // The article is what the packages route measures, so it never transforms. The lift is applied to the
    // inner .package-card, which also carries the background, border and shadow.
    <article data-popular={pkg.popular ? "" : undefined} className="group/card relative flex">
      <div
        className={cn(
          "package-card relative flex flex-1 flex-col rounded-2xl border bg-white p-6 shadow-sm dark:bg-ink-900",
          "transition-[transform,box-shadow,border-color] duration-300 ease-out",
          // Lift and a larger shadow (a saffron glow in dark mode). hover: only applies on hover-capable devices;
          // keyboard focus uses :focus-visible so tapping a button on touch never leaves the card lifted.
          "motion-safe:group-hover/card:-translate-y-1.5 motion-safe:group-has-[:focus-visible]/card:-translate-y-1.5",
          "group-hover/card:shadow-[0_18px_34px_-14px] group-hover/card:shadow-ink-900/25 group-has-[:focus-visible]/card:shadow-[0_18px_34px_-14px] group-has-[:focus-visible]/card:shadow-ink-900/25",
          "dark:group-hover/card:shadow-[0_0_30px_-6px] dark:group-hover/card:shadow-saffron-500/30 dark:group-has-[:focus-visible]/card:shadow-[0_0_30px_-6px] dark:group-has-[:focus-visible]/card:shadow-saffron-500/30",
          pkg.popular
            ? "border-saffron-500"
            : "border-lagoon-600/15 group-hover/card:border-saffron-500/55 group-has-[:focus-visible]/card:border-saffron-500/55 dark:border-white/10",
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
        <h3 className="mt-1 text-2xl font-semibold text-ink-900 transition-colors duration-300 ease-out group-hover/card:text-saffron-600 group-has-[:focus-visible]/card:text-saffron-600 dark:text-white dark:group-hover/card:text-saffron-400 dark:group-has-[:focus-visible]/card:text-saffron-400">
          {pkg.title}
        </h3>
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
        <ItineraryButton pkg={pkg} />
      </div>
    </article>
  );
}

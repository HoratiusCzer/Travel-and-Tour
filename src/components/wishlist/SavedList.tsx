"use client";

import { DestinationCard } from "@/components/destinations/DestinationCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { destinations } from "@/data/destinations";
import { destinationKey } from "@/lib/wishlist-keys";
import { useWishlist } from "./WishlistProvider";

export function SavedList() {
  const { has, ready } = useWishlist();
  if (!ready) return null;

  const savedDestinations = destinations.filter((d) => has(destinationKey(d.slug)));

  if (!savedDestinations.length) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-ink-800/80 dark:text-lagoon-50/75">
          Nothing saved yet. Tap the heart on any destination to keep it here.
        </p>
        <ButtonLink href="/#destinations" className="mt-6">
          Browse destinations
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {savedDestinations.length > 0 && (
        <div>
          <h2 className="mb-6 text-2xl font-semibold text-ink-900 dark:text-white">Destinations</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedDestinations.map((d) => (
              <DestinationCard key={d.slug} destination={d} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

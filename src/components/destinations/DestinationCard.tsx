import Image from "next/image";
import Link from "next/link";
import type { Destination } from "@/data/destinations";

export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className="group relative block overflow-hidden rounded-2xl bg-ink-900 shadow-md"
    >
      <div className="relative aspect-[4/5]">
        <Image
          src={destination.image}
          alt={`${destination.name}, ${destination.country}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <span className="rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur">{destination.category}</span>
        <h3 className="mt-2 text-2xl font-semibold">{destination.name}</h3>
        <p className="text-sm text-white/80">
          {destination.country} · ★ {destination.rating.toFixed(1)}
        </p>
      </div>
    </Link>
  );
}

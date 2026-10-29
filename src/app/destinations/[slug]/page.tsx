import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/destinations/Gallery";
import { PackageCard } from "@/components/packages/PackageCard";
import { HeartButton } from "@/components/wishlist/HeartButton";
import { destinationKey } from "@/lib/wishlist-keys";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { destinations, getDestination } from "@/data/destinations";
import { packages } from "@/data/packages";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const destination = getDestination((await params).slug);
  return destination
    ? { title: destination.name, description: destination.tagline }
    : { title: "Destination not found" };
}

export default async function DestinationPage({ params }: { params: Params }) {
  const destination = getDestination((await params).slug);
  if (!destination) notFound();

  const related = packages.filter((p) => p.destinationSlug === destination.slug);
  // Only one photo per destination exists, so the gallery pairs it with similar destinations.
  const galleryItems = [
    destination,
    ...destinations.filter((d) => d.category === destination.category && d.slug !== destination.slug),
  ].map((d) => ({
    src: d.image,
    alt: `${d.name}, ${d.country}`,
    caption: `${d.name}, ${d.country}`,
  }));
  const facts = [
    { label: "Best season", value: destination.bestSeason },
    { label: "Ideal stay", value: destination.idealStay },
    { label: "Rating", value: `★ ${destination.rating.toFixed(1)}` },
    { label: "Style", value: destination.category },
  ];

  return (
    <>
      <section className="relative isolate">
        <Image
          src={destination.image}
          alt={`${destination.name}, ${destination.country}`}
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-950/85 via-ink-950/40 to-ink-950/30" />
        <Container className="flex min-h-[55vh] flex-col justify-end pb-12 pt-24 text-white">
          <Link href="/#destinations" className="mb-4 text-sm text-white/80 hover:text-saffron-400">
            ← All destinations
          </Link>
          <p className="text-sm uppercase tracking-[0.2em] text-saffron-400">{destination.country}</p>
          <h1 className="mt-1 text-4xl font-semibold sm:text-6xl">{destination.name}</h1>
          <p className="mt-3 max-w-xl text-lg text-white/85">{destination.tagline}</p>
        </Container>
      </section>

      <Container className="grid gap-12 py-14 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold text-ink-900 dark:text-white">About this destination</h2>
          <p className="mt-3 leading-relaxed text-ink-800/85 dark:text-lagoon-50/80">{destination.description}</p>
          <h3 className="mt-8 text-xl font-semibold text-ink-900 dark:text-white">Trip highlights</h3>
          <ul className="mt-3 space-y-2">
            {destination.highlights.map((h) => (
              <li key={h} className="flex gap-2">
                <span aria-hidden className="text-saffron-600 dark:text-saffron-400">✦</span>
                {h}
              </li>
            ))}
          </ul>
        </div>
        <aside className="h-fit rounded-2xl border border-lagoon-600/15 bg-white p-6 dark:border-white/10 dark:bg-ink-900">
          <h2 className="text-lg font-semibold text-ink-900 dark:text-white">Quick facts</h2>
          <dl className="mt-4 space-y-3 text-sm">
            {facts.map((f) => (
              <div key={f.label} className="flex justify-between gap-4">
                <dt className="text-ink-800/60 dark:text-lagoon-50/60">{f.label}</dt>
                <dd className="text-right font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>
          <ButtonLink href="/#contact" className="mt-6 w-full">
            Plan this trip
          </ButtonLink>
          <HeartButton
            itemKey={destinationKey(destination.slug)}
            name={destination.name}
            showLabel
            className="mt-3 w-full"
          />
        </aside>
      </Container>

      <Container className="pb-14">
        <h2 className="mb-6 text-2xl font-semibold text-ink-900 dark:text-white">Gallery</h2>
        <Gallery items={galleryItems} />
      </Container>

      {related.length > 0 && (
        <Container className="pb-20">
          <h2 className="mb-6 text-2xl font-semibold text-ink-900 dark:text-white">
            Packages in {destination.name}
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {related.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </Container>
      )}
    </>
  );
}

import Image from "next/image";
import { HeroWater } from "@/components/effects/HeroWater";
import { SearchBar } from "./SearchBar";

const HERO_PHOTO = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2000&q=75";
// The water effect uses the optimized copy of the same photo the <Image> below shows, so the crop matches.
const HERO_TEXTURE = `/_next/image?url=${encodeURIComponent(HERO_PHOTO)}&w=1920&q=75`;

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src={HERO_PHOTO}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <HeroWater src={HERO_TEXTURE} />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/70 via-ink-950/45 to-ink-950/80" />
      <div className="mx-auto max-w-4xl px-4 py-24 text-center text-white sm:py-32 lg:py-40">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-saffron-400">
          Small-group journeys
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-6xl">
          Find the trip that feels like <em className="text-saffron-400">yours</em>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-white/85">
          From alpine ridges to lantern-lit alleys, we plan the details so you can enjoy the
          wandering.
        </p>
        <SearchBar />
      </div>
    </section>
  );
}

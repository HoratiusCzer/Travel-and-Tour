import Image from "next/image";
import { SearchBar } from "./SearchBar";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2000&q=75"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
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

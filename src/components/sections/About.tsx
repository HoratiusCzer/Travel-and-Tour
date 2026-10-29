import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const stats = [
  { value: "12k+", label: "Happy travellers" },
  { value: "40+", label: "Countries covered" },
  { value: "98%", label: "Would book again" },
];

export function About() {
  return (
    <section id="about" className="py-20">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
          <Image
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=75"
            alt="Travellers on a scenic road trip"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <SectionHeading
            align="left"
            eyebrow="About us"
            title="Travel planned by people who love to wander"
          />
          <p className="-mt-6 text-ink-800/80 dark:text-lagoon-50/75">
            Travels and Tour started with a simple idea: a good trip should feel personal, not
            packaged. We keep groups small, hire local guides and leave breathing room in every
            itinerary for the detours you will talk about later.
          </p>
          <dl className="mt-8 grid grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="text-xs text-ink-800/60 dark:text-lagoon-50/60">{s.label}</dt>
                <dd className="font-display text-3xl font-semibold text-lagoon-700 dark:text-saffron-400">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}

import { StoriesRays } from "@/components/effects/StoriesRays";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials } from "@/data/testimonials";

export function Testimonials() {
  return (
    <section id="testimonials" className="relative overflow-hidden bg-lagoon-900 py-20 text-lagoon-50">
      <StoriesRays />
      <div className="relative z-10">
        <Container>
          <div className="[&_h2]:text-white [&_p]:text-lagoon-100/80">
            <SectionHeading eyebrow="Traveller stories" title="Kind words from the road" />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
                <blockquote className="text-base leading-relaxed">“{t.quote}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span
                    aria-hidden
                    className="grid h-10 w-10 place-items-center rounded-full bg-saffron-500 text-sm font-semibold text-ink-950"
                  >
                    {t.initials}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">{t.name}</span>
                    <span className="block text-xs text-lagoon-100/70">{t.trip}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}

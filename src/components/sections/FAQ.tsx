import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const faqs = [
  {
    q: "How do I book a trip?",
    a: "Send us an enquiry through the contact form. A travel designer replies within one working day with a tailored outline, and you confirm only when you are happy with it.",
  },
  {
    q: "Can I change a package to suit me?",
    a: "Yes. Every package is a starting point. Tell us about your dates, pace and interests and we will adjust the itinerary.",
  },
  {
    q: "How big are the groups?",
    a: "We keep groups small. Each package shows its maximum group size, and private departures are available on request.",
  },
  {
    q: "Are the prices per person?",
    a: "Yes, all listed prices are per person. The trip estimate above multiplies by the number of travellers, and your final quote confirms exactly what is included.",
  },
  {
    q: "What if I need help during the trip?",
    a: "Your local guide is with you throughout, and our team is a message away if anything changes along the way.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-20">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Questions, answered" />
        <div className="divide-y divide-lagoon-600/15 rounded-2xl border border-lagoon-600/15 bg-white dark:divide-white/10 dark:border-white/10 dark:bg-ink-900">
          {faqs.map((f) => (
            <details key={f.q} className="group px-6 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium text-ink-900 dark:text-white [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden className="text-2xl leading-none text-saffron-600 transition group-open:rotate-45 dark:text-saffron-400">+</span>
              </summary>
              <p className="mt-3 text-ink-800/80 dark:text-lagoon-50/75">{f.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}

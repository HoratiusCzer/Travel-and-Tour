"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getDestination } from "@/data/destinations";
import { packages } from "@/data/packages";
import { formatPrice } from "@/lib/format";

const MAX_TRAVELLERS = 12;
const fieldClass =
  "w-full rounded-xl border border-lagoon-600/25 bg-white px-4 py-3 text-ink-900 focus:border-lagoon-500 focus:outline-none dark:border-white/15 dark:bg-ink-900 dark:text-white";

export function TripCalculator() {
  const [packageId, setPackageId] = useState(packages[0].id);
  const [travellers, setTravellers] = useState(2);
  const [month, setMonth] = useState("");

  const pkg = packages.find((p) => p.id === packageId) ?? packages[0];
  const destination = getDestination(pkg.destinationSlug);
  const total = pkg.price * travellers;

  function requestQuote() {
    const when = month ? ` around ${month}` : "";
    const text = `Hi! I'd like a quote for the ${pkg.title} (${destination?.name}, ${pkg.days} days) for ${travellers} traveller${travellers === 1 ? "" : "s"}${when}. Estimated total: ${formatPrice(total)}.`;
    window.dispatchEvent(new CustomEvent("prefill-contact", { detail: text }));
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section id="calculator" className="bg-sand-100 py-20 dark:bg-ink-900/60">
      <Container className="max-w-4xl">
        <SectionHeading
          eyebrow="Trip budget"
          title="Estimate your trip"
          description="Pick a package and group size to see a quick price estimate."
        />
        <div className="grid gap-8 rounded-3xl border border-lagoon-600/15 bg-white p-6 sm:p-8 md:grid-cols-2 dark:border-white/10 dark:bg-ink-950">
          <div className="space-y-5">
            <div>
              <label htmlFor="calc-package" className="mb-1 block text-sm font-medium">Package</label>
              <select id="calc-package" value={packageId} onChange={(e) => setPackageId(e.target.value)} className={fieldClass}>
                {packages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} · {getDestination(p.destinationSlug)?.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span id="calc-travellers" className="mb-1 block text-sm font-medium">Travellers</span>
              <div role="group" aria-labelledby="calc-travellers" className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Fewer travellers"
                  disabled={travellers <= 1}
                  onClick={() => setTravellers((n) => n - 1)}
                  className="grid h-11 w-11 place-items-center rounded-full border border-lagoon-600/30 text-xl disabled:opacity-40 dark:border-lagoon-400/30"
                >
                  −
                </button>
                <output aria-live="polite" className="w-10 text-center text-xl font-semibold tabular-nums">{travellers}</output>
                <button
                  type="button"
                  aria-label="More travellers"
                  disabled={travellers >= MAX_TRAVELLERS}
                  onClick={() => setTravellers((n) => n + 1)}
                  className="grid h-11 w-11 place-items-center rounded-full border border-lagoon-600/30 text-xl disabled:opacity-40 dark:border-lagoon-400/30"
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="calc-month" className="mb-1 block text-sm font-medium">Preferred month (optional)</label>
              <input id="calc-month" type="month" value={month} onChange={(e) => setMonth(e.target.value)} className={fieldClass} />
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-2xl bg-lagoon-900 p-6 text-white">
            <div>
              <p className="text-sm text-lagoon-200">
                {pkg.title} · {pkg.days} days
              </p>
              <p className="mt-4 text-xs uppercase tracking-wide text-white/60">Estimated total</p>
              <p aria-live="polite" className="font-display text-5xl font-semibold text-saffron-400">{formatPrice(total)}</p>
              <p className="mt-1 text-sm text-white/70">
                {formatPrice(pkg.price)} × {travellers} traveller{travellers === 1 ? "" : "s"}
              </p>
            </div>
            <div className="mt-6">
              <button
                type="button"
                onClick={requestQuote}
                className="w-full rounded-full bg-saffron-500 px-6 py-3 text-sm font-semibold text-ink-950 transition hover:bg-saffron-400"
              >
                Request this quote
              </button>
              <p className="mt-3 text-xs text-white/60">An estimate only. Your travel designer confirms the final price.</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

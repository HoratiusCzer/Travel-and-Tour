import { PackageCard } from "@/components/packages/PackageCard";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { packages } from "@/data/packages";

export function Packages() {
  return (
    <section id="packages" className="bg-sand-100 py-20 dark:bg-ink-900/60">
      <Container>
        <SectionHeading
          eyebrow="Tour packages"
          title="Clear prices, no fine-print surprises"
          description="Every package includes stays, guides and key experiences. Flights are flexible, so you choose how to arrive."
        />
        <div className="package-route grid gap-6 pl-7 md:grid-cols-2 md:pl-0 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </Container>
    </section>
  );
}

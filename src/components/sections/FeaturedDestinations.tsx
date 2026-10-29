import { Suspense } from "react";
import { DestinationExplorer } from "@/components/destinations/DestinationExplorer";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function FeaturedDestinations() {
  return (
    <section id="destinations" className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Featured destinations"
          title="Places worth packing for"
          description="Hand-picked corners of the world, each with a local guide and a plan that leaves room for surprise."
        />
        <Suspense fallback={<p className="text-center">Loading destinations…</p>}>
          <DestinationExplorer />
        </Suspense>
      </Container>
    </section>
  );
}

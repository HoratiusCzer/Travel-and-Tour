import { Suspense } from "react";
import { DestinationExplorer } from "@/components/destinations/DestinationExplorer";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Skeleton } from "@/components/ui/Skeleton";
import { ScrollBackground } from "./ScrollBackground";

export function FeaturedDestinations() {
  return (
    <ScrollBackground id="destinations" className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Featured destinations"
          title="Places worth packing for"
          description="Hand-picked corners of the world, each with a local guide and a plan that leaves room for surprise."
        />
        <Suspense
          fallback={
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} className="aspect-[4/5]" />
              ))}
            </div>
          }
        >
          <DestinationExplorer />
        </Suspense>
      </Container>
    </ScrollBackground>
  );
}

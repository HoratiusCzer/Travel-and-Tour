import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SavedList } from "@/components/wishlist/SavedList";

export const metadata: Metadata = { title: "Saved trips" };

export default function SavedPage() {
  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="Your wishlist"
        title="Saved trips"
        description="Destinations and packages you have hearted. They are stored in this browser."
      />
      <SavedList />
    </Container>
  );
}

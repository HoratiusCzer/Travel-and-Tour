import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { FAQ } from "@/components/sections/FAQ";
import { FeaturedDestinations } from "@/components/sections/FeaturedDestinations";
import { Hero } from "@/components/sections/Hero";
import { PackageJourney } from "@/components/packages/PackageJourney";
import { Packages } from "@/components/sections/Packages";
import { Testimonials } from "@/components/sections/Testimonials";
import { TripCalculator } from "@/components/sections/TripCalculator";
import { Reveal } from "@/components/ui/Reveal";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedDestinations />
      <PackageJourney>
        <Reveal>
          <Packages />
        </Reveal>
        <Reveal>
          <TripCalculator />
        </Reveal>
      </PackageJourney>
      <Reveal>
        <About />
      </Reveal>
      <Reveal>
        <Testimonials />
      </Reveal>
      <Reveal>
        <FAQ />
      </Reveal>
      <Reveal>
        <Contact />
      </Reveal>
    </>
  );
}

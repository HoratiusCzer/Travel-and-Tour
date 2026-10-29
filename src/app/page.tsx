import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { FeaturedDestinations } from "@/components/sections/FeaturedDestinations";
import { Hero } from "@/components/sections/Hero";
import { Packages } from "@/components/sections/Packages";
import { Testimonials } from "@/components/sections/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedDestinations />
      <Packages />
      <About />
      <Testimonials />
      <Contact />
    </>
  );
}

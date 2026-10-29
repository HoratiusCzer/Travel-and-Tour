import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-ink-900 py-14 text-lagoon-50/80">
      <Container>
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo light />
            <p className="mt-4 max-w-sm text-sm">
              Thoughtfully designed journeys for curious travellers. Small groups, local guides and
              plenty of room to wander.
            </p>
          </div>
          <div>
            <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-white">Explore</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/#destinations" className="hover:text-saffron-400">Destinations</Link></li>
              <li><Link href="/#packages" className="hover:text-saffron-400">Tour packages</Link></li>
              <li><Link href="/#about" className="hover:text-saffron-400">About us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-white">Say hello</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>hello@travelsandtour.example</li>
              <li>+977 1 555 0142</li>
              <li>Thamel, Kathmandu</li>
            </ul>
          </div>
        </div>
        <p className="mt-12 border-t border-white/10 pt-6 text-xs text-lagoon-50/60">
          © {new Date().getFullYear()} Travels and Tour. Built by Softsaro Nepal.
        </p>
      </Container>
    </footer>
  );
}

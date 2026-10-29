"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SavedLink } from "@/components/wishlist/SavedLink";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/#destinations", label: "Destinations" },
  { href: "/#packages", label: "Packages" },
  { href: "/#about", label: "About" },
  { href: "/#testimonials", label: "Stories" },
  { href: "/#contact", label: "Contact" },
];

// Sticky header height (h-16 plus its 1px border); the active section changes once it scrolls under this line.
const HEADER_OFFSET = 65;

export function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const onHome = usePathname() === "/";

  // A fresh load of /#section stays at the top because images and the scroll animation shift the layout
  // after the browser's own jump, so repeat the jump once the page has settled.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!onHome || !id) return;
    const jump = () => document.getElementById(id)?.scrollIntoView();
    let timer = 0;
    const settle = () => {
      jump();
      timer = window.setTimeout(jump, 400);
    };
    if (document.readyState === "complete") settle();
    else window.addEventListener("load", settle, { once: true });
    return () => {
      window.removeEventListener("load", settle);
      clearTimeout(timer);
    };
  }, [onHome]);

  useEffect(() => {
    if (!onHome) {
      setActive(null);
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      let current: string | null = null;
      for (const l of links) {
        const id = l.href.split("#")[1];
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= HEADER_OFFSET + window.innerHeight * 0.25) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [onHome]);

  const isActive = (href: string) => active !== null && href.endsWith(`#${active}`);

  return (
    <header className="sticky top-0 z-40 border-b border-lagoon-600/10 bg-sand-50/85 backdrop-blur dark:border-white/10 dark:bg-ink-950/85">
      {/* Three equal-weight columns keep the links centered on the page whatever the side groups' widths. */}
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto] items-center px-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        <div className="justify-self-start">
          <Logo />
        </div>
        <nav aria-label="Main" className="hidden items-center gap-8 justify-self-center lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "location" : undefined}
              className={cn(
                "whitespace-nowrap text-sm font-medium transition hover:text-lagoon-600 dark:hover:text-saffron-400",
                isActive(l.href)
                  ? "text-lagoon-600 dark:text-saffron-400"
                  : "text-ink-800/80 dark:text-lagoon-50/80",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 justify-self-end">
          <SavedLink />
          <ThemeToggle />
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-lagoon-600/30 lg:hidden dark:border-lagoon-400/30"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden>{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-lagoon-600/10 px-4 pb-4 lg:hidden dark:border-white/10">
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(l.href) ? "location" : undefined}
                  className={cn(
                    "block py-3 text-base font-medium",
                    isActive(l.href) ? "text-lagoon-600 dark:text-saffron-400" : "text-ink-800 dark:text-lagoon-50",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

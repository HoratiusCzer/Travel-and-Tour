"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { FloatingActions } from "./FloatingActions";
import { Header } from "./Header";
import { ScrollProgress } from "./ScrollProgress";

const AUTH_ROUTES = ["/login", "/signup"];

/** The normal site frame, left off the full-screen sign-in and sign-up pages. */
export function SiteChrome({ children, footer }: { children: ReactNode; footer: ReactNode }) {
  const bare = AUTH_ROUTES.includes(usePathname());
  if (bare) return <main>{children}</main>;
  return (
    <>
      <ScrollProgress />
      <Header />
      <main>{children}</main>
      {footer}
      <FloatingActions />
    </>
  );
}

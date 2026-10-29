import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
}

export function ButtonLink({ href, children, variant = "primary", className }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition",
        variant === "primary" &&
          "bg-saffron-500 text-ink-950 shadow-lg shadow-saffron-500/25 hover:bg-saffron-400",
        variant === "ghost" &&
          "border border-lagoon-600/40 text-lagoon-700 hover:bg-lagoon-50 dark:border-lagoon-400/40 dark:text-lagoon-200 dark:hover:bg-lagoon-900",
        className,
      )}
    >
      {children}
    </Link>
  );
}

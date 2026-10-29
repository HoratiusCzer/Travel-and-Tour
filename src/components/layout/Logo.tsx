import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 font-display text-xl font-semibold">
      <span
        aria-hidden
        className="grid h-8 w-8 place-items-center rounded-full bg-saffron-500 text-sm text-ink-950"
      >
        ✦
      </span>
      <span className={light ? "text-white" : "text-ink-900 dark:text-white"}>Travels and Tour</span>
    </Link>
  );
}

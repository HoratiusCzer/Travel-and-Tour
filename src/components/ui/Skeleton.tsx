import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-2xl bg-ink-800/10 motion-reduce:animate-none dark:bg-white/10", className)}
    />
  );
}

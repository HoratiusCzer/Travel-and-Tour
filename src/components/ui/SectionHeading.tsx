import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({ eyebrow, title, description, align = "center" }: SectionHeadingProps) {
  return (
    <div className={cn("mb-10 max-w-2xl", align === "center" && "mx-auto text-center")}>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-saffron-600 dark:text-saffron-400">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-semibold text-ink-900 sm:text-4xl dark:text-white">{title}</h2>
      {description && <p className="mt-3 text-base text-ink-800/75 dark:text-lagoon-50/70">{description}</p>}
    </div>
  );
}

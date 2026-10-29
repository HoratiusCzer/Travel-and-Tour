import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="py-32 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-saffron-600 dark:text-saffron-400">404</p>
      <h1 className="mt-2 text-4xl font-semibold text-ink-900 dark:text-white">This trail goes nowhere</h1>
      <p className="mt-3 text-ink-800/75 dark:text-lagoon-50/70">
        We couldn’t find that page, but there are plenty of other places to explore.
      </p>
      <ButtonLink href="/" className="mt-8">
        Back to home
      </ButtonLink>
    </Container>
  );
}

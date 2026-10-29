import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <Container className="py-16" aria-busy="true">
      <Skeleton className="mx-auto h-10 w-2/3 max-w-md" />
      <Skeleton className="mx-auto mt-4 h-5 w-1/2 max-w-sm" />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="aspect-[4/5]" />
        ))}
      </div>
    </Container>
  );
}

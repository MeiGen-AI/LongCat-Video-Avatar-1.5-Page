import { Skeleton } from '../components/ui';
export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <Skeleton className="h-10 w-72" />
      <Skeleton className="mt-8 h-64 w-full" />
    </main>
  );
}

'use client';
import { Button } from '../components/ui';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center text-center">
      <div>
        <h1 className="text-3xl font-semibold">The frame slipped.</h1>
        <Button className="mt-5" onClick={reset}>
          Try again
        </Button>
      </div>
    </main>
  );
}

import Link from 'next/link';
export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 text-center">
      <div>
        <p className="text-amber">404</p>
        <h1 className="mt-3 text-5xl font-semibold">That frame is missing.</h1>
        <Link
          href="/"
          className="mt-7 inline-block rounded-xl bg-amber px-5 py-3 font-semibold text-ink"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}

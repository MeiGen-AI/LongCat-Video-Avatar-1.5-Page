import Link from 'next/link';
export default function Terms() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="text-2xl font-semibold">
        fakhm<span className="text-amber">.</span>
      </Link>
      <h1 className="mt-20 text-5xl font-semibold">Terms of service</h1>
      <p className="mt-6 leading-8 text-stone-400">
        Fakhm Studio helps you create avatar videos from material you have the right to use. You
        retain ownership of your source material and grant us only the license needed to provide the
        service. Do not upload unlawful, deceptive, or harmful material.
      </p>
    </main>
  );
}

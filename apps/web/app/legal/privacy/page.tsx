import Link from 'next/link';
export default function Privacy() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="text-2xl font-semibold">
        fakhm<span className="text-amber">.</span>
      </Link>
      <h1 className="mt-20 text-5xl font-semibold">Privacy</h1>
      <p className="mt-6 leading-8 text-stone-400">
        We use your account information, uploaded media, and product analytics to authenticate you,
        render requested videos, protect the platform, and improve the experience. We do not sell
        personal information.
      </p>
    </main>
  );
}

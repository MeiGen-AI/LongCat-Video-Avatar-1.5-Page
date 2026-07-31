import Link from 'next/link';
import { Footer } from '../../components/ui';
export default function Pricing() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10">
      <Link href="/" className="text-2xl font-semibold">
        fakhm<span className="text-amber">.</span>
      </Link>
      <div className="py-24 text-center">
        <p className="text-xs uppercase tracking-[.3em] text-amber">Simple, intentional pricing</p>
        <h1 className="mt-4 text-5xl font-semibold">More presence per credit.</h1>
        <p className="mx-auto mt-5 max-w-xl text-stone-400">
          Start for free, then scale as your voice finds its audience.
        </p>
        <div className="mt-12 grid gap-4 text-left md:grid-cols-3">
          {[
            ['Free', '60', '$0'],
            ['Creator', '600', '$9.99'],
            ['Studio', '2,400', '$29.99'],
          ].map(([name, credits, price]) => (
            <div key={name} className="glass rounded-2xl p-7">
              <h2 className="text-xl font-semibold">{name}</h2>
              <p className="mt-5 text-3xl font-semibold text-amber">{price}</p>
              <p className="mt-2 text-sm text-stone-500">{credits} credits each month</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}

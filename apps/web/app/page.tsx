import Link from 'next/link';
import { ArrowRight, AudioLines, Clapperboard, Sparkles } from 'lucide-react';
const features = [
  ['One image. One voice.', 'Upload a reference image and your audio. Fakhm handles the rest.'],
  [
    'LongCat precision',
    'Natural lip sync and expressive motion powered by LongCat-Video-Avatar 1.5.',
  ],
  ['Your creative library', 'Every render, safely stored and ready to share.'],
];
export default function Home() {
  return (
    <main>
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7">
        <strong className="text-2xl tracking-tight">
          fakhm<span className="text-amber">.</span>
        </strong>
        <div className="flex items-center gap-6 text-sm text-stone-300">
          <Link href="#pricing">Pricing</Link>
          <Link href="/login">Sign in</Link>
          <Link href="/studio" className="rounded-full bg-amber px-5 py-2 font-semibold text-ink">
            Open studio
          </Link>
        </div>
      </nav>
      <section className="mx-auto grid max-w-6xl gap-14 px-6 pb-28 pt-20 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-6 flex items-center gap-2 text-sm uppercase tracking-[.3em] text-amber">
            <Sparkles size={16} /> Human stories, amplified
          </p>
          <h1 className="text-6xl font-semibold leading-[.98] tracking-tight md:text-8xl">
            Give your voice a <em className="font-serif text-amber">face.</em>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-stone-300">
            Fakhm Studio turns one reference image and one audio file into a natural, lip-synced
            avatar video. Made for creators who care about the final frame.
          </p>
          <div className="mt-10 flex gap-4">
            <Link
              href="/studio"
              className="flex items-center gap-2 rounded-full bg-amber px-6 py-3 font-semibold text-ink"
            >
              Create a video <ArrowRight size={18} />
            </Link>
            <Link href="#how" className="rounded-full border border-white/15 px-6 py-3">
              See how it works
            </Link>
          </div>
        </div>
        <div className="glass relative aspect-[4/5] overflow-hidden rounded-[2rem] p-3">
          <div className="flex h-full items-end rounded-[1.5rem] bg-gradient-to-br from-stone-700 via-stone-900 to-amber-950 p-8">
            <div>
              <span className="rounded-full bg-black/30 px-3 py-1 text-xs text-amber">
                A new kind of presence
              </span>
              <p className="mt-3 text-3xl font-medium">Built for the stories only you can tell.</p>
            </div>
          </div>
        </div>
      </section>
      <section id="how" className="mx-auto max-w-6xl px-6 py-24">
        <p className="text-sm uppercase tracking-[.3em] text-amber">The Fakhm way</p>
        <h2 className="mt-4 max-w-2xl text-4xl font-semibold">
          From raw material to remarkable in minutes.
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {features.map(([title, body], i) => (
            <article className="glass rounded-2xl p-7" key={title}>
              <div className="mb-12 text-amber">
                {i === 0 ? <AudioLines /> : i === 1 ? <Sparkles /> : <Clapperboard />}
              </div>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-3 leading-7 text-stone-400">{body}</p>
            </article>
          ))}
        </div>
      </section>
      <section id="pricing" className="border-t border-white/10 px-6 py-20 text-center">
        <p className="text-amber">Start creating</p>
        <h2 className="mt-3 text-4xl font-semibold">Your next story is waiting.</h2>
        <Link
          href="/signup"
          className="mt-8 inline-flex rounded-full bg-amber px-7 py-3 font-semibold text-ink"
        >
          Get started free
        </Link>
      </section>
      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-stone-500">
        © 2026 Fakhm Studio
      </footer>
    </main>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createAdmin } from '../../../lib/supabase/admin';
import { signedDownload } from '../../../lib/storage';
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { data } = await createAdmin()
    .from('generations')
    .select('title')
    .eq('share_slug', params.slug)
    .eq('visibility', 'unlisted')
    .maybeSingle();
  return {
    title: data?.title ? `${data.title} · Fakhm Studio` : 'A Fakhm Studio creation',
    description: 'A video created with Fakhm Studio.',
  };
}
export default async function Share({ params }: { params: { slug: string } }) {
  const { data } = await createAdmin()
    .from('generations')
    .select('*, assets:output_asset_id(*)')
    .eq('share_slug', params.slug)
    .eq('visibility', 'unlisted')
    .maybeSingle();
  if (!data) notFound();
  const asset = Array.isArray(data.assets) ? data.assets[0] : data.assets;
  const src = asset?.path ? await signedDownload('outputs', asset.path) : undefined;
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-6">
      <div className="w-full max-w-4xl">
        <p className="text-xs uppercase tracking-[.3em] text-amber">A Fakhm Studio creation</p>
        <h1 className="mt-4 text-4xl font-semibold">{data.title ?? 'Untitled render'}</h1>
        {src ? (
          <video
            className="mt-8 aspect-video w-full rounded-2xl border border-white/10 bg-black"
            controls
            src={src}
          >
            <track kind="captions" />
          </video>
        ) : (
          <p className="mt-8 text-stone-500">This creation is not ready.</p>
        )}
      </div>
    </main>
  );
}

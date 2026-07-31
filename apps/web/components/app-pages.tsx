'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { estimateCredits, formatDuration, type GenerationStatus } from '@fakhm/shared';
import { AppShell } from './layout/app-shell';
import {
  AudioPicker,
  ImageReferencePicker,
  JobCard,
  ParamsPanel,
  VideoPlayer,
} from './features/studio';
import {
  Badge,
  Button,
  Card,
  CreditPill,
  Dialog,
  EmptyState,
  Input,
  Label,
  Pagination,
  Select,
  Skeleton,
  Tabs,
  ThemeToggle,
} from './ui';

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { 'content-type': 'application/json', ...init?.headers },
  });
  const payload = (await response.json()) as T & { error?: { message: string } };
  if (!response.ok) throw new Error(payload.error?.message ?? 'Request failed');
  return payload;
}
function useGenerations() {
  return useQuery({
    queryKey: ['generations'],
    queryFn: () =>
      api<{ items: Array<Record<string, unknown>>; total: number }>('/api/generations'),
  });
}
function Header({ title, eyebrow }: { title: string; eyebrow: string }) {
  return (
    <header className="mb-10 flex items-end justify-between">
      <div>
        <p className="text-xs uppercase tracking-[.3em] text-amber">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">{title}</h1>
      </div>
      <ThemeToggle />
    </header>
  );
}
export function StudioPage() {
  const [image, setImage] = useState<File>();
  const [audio, setAudio] = useState<File>();
  const [params, setParams] = useState({ resolution: '720p', fps: 30, enhance: true });
  const [jobId, setJobId] = useState<string>();
  const [message, setMessage] = useState('');
  const mutation = useMutation({
    mutationFn: async () => {
      if (!image || !audio) throw new Error('Add an image and audio track first.');
      const sign = async (file: File, kind: 'image' | 'audio') => {
        const result = await api<{
          assetId: string;
          upload: { path: string; token: string; signedUrl: string };
        }>('/api/uploads/sign', {
          method: 'POST',
          body: JSON.stringify({ kind, mime: file.type, bytes: file.size, filename: file.name }),
        });
        const upload = await fetch(result.upload.signedUrl, {
          method: 'PUT',
          headers: {
            'x-upsert': 'true',
            'content-type': file.type,
            authorization: `Bearer ${result.upload.token}`,
          },
          body: file,
        });
        if (!upload.ok) throw new Error('Upload failed');
        return result.assetId;
      };
      const [imageAssetId, audioAssetId] = await Promise.all([
        sign(image, 'image'),
        sign(audio, 'audio'),
      ]);
      return api<{ generation: { id: string } }>('/api/generations', {
        method: 'POST',
        body: JSON.stringify({ imageAssetId, audioAssetId, ...params }),
      });
    },
    onSuccess: (result) => setJobId(result.generation.id),
    onError: (error) => setMessage(error.message),
  });
  const job = useQuery({
    queryKey: ['generation', jobId],
    queryFn: () =>
      api<{ generation: { status: GenerationStatus; progress: number; title: string | null } }>(
        `/api/generations/${jobId}`,
      ),
    enabled: Boolean(jobId),
    refetchInterval: (query) =>
      query.state.data?.generation.status === 'succeeded' ||
      query.state.data?.generation.status === 'failed'
        ? false
        : 3000,
  });
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Header eyebrow="The studio" title="Make them listen." />
        <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
          <Card>
            <div className="grid gap-5 md:grid-cols-2">
              <ImageReferencePicker file={image} onFile={setImage} />
              <AudioPicker file={audio} onFile={setAudio} />
            </div>
            <div className="mt-6">
              <ParamsPanel duration={1} onChange={setParams} />
            </div>
            <Button
              className="mt-6 w-full"
              size="lg"
              loading={mutation.isPending}
              onClick={() => mutation.mutate()}
            >
              Generate video
            </Button>
            {message && <p className="mt-3 text-sm text-red-300">{message}</p>}
          </Card>
          <div>
            {job?.data ? (
              <JobCard
                status={job.data.generation.status}
                progress={job.data.generation.progress}
                title={job.data.generation.title}
              />
            ) : (
              <Card className="h-full">
                <p className="text-xs uppercase tracking-[.2em] text-stone-500">Your next frame</p>
                <h2 className="mt-4 text-3xl font-semibold">
                  A little raw material. A lot of presence.
                </h2>
                <p className="mt-5 leading-7 text-stone-500">
                  Upload your source files and choose the feeling you want to leave behind.
                </p>
                <div className="mt-12 grid grid-cols-3 gap-2 text-center text-xs text-stone-600">
                  <span>01 · Image</span>
                  <span>02 · Voice</span>
                  <span>03 · Render</span>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
export function LibraryPage() {
  const { data, isLoading, refetch } = useGenerations();
  const [status, setStatus] = useState('');
  const items = (data?.items ?? []).filter((item) => !status || item.status === status);
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Header eyebrow="Your archive" title="Library" />
        <div className="mb-6 flex gap-3">
          <Select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="max-w-xs"
          >
            <option value="">Every render</option>
            {['queued', 'processing', 'succeeded', 'failed'].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </Select>
          <Button variant="secondary" onClick={() => refetch()}>
            Refresh
          </Button>
        </div>
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-56" />
            ))}
          </div>
        ) : items.length ? (
          <div className="grid gap-4 md:grid-cols-3">
            {items.map((item) => (
              <Link href={`/generations/${item.id}`} key={String(item.id)}>
                <Card className="transition hover:-translate-y-1 hover:border-amber/30">
                  <div className="flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br from-violet-950 to-amber-950 text-amber">
                    fakhm.
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="font-semibold">{String(item.title ?? 'Untitled render')}</h3>
                      <p className="mt-1 text-xs text-stone-500">
                        {new Date(String(item.queued_at)).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge tone="violet">{String(item.status)}</Badge>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Your library is quiet."
            body="Generated videos will live here, ready to revisit and share."
            action={
              <Link href="/studio">
                <Button>Start a render</Button>
              </Link>
            }
          />
        )}
      </div>
    </AppShell>
  );
}
export function BillingPage() {
  const checkout = useMutation({
    mutationFn: (plan: 'creator' | 'studio') =>
      api<{ url: string }>('/api/billing/checkout', {
        method: 'POST',
        body: JSON.stringify({ plan }),
      }),
    onSuccess: (result) => {
      window.location.href = result.url;
    },
  });
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Header eyebrow="Your account" title="Billing" />
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ['free', 'Free', '60 credits / month'],
            ['creator', 'Creator', '600 credits / month'],
            ['studio', 'Studio', '2,400 credits / month'],
          ].map(([key, name, description]) => (
            <Card key={key} className={key === 'creator' ? 'border-amber/40' : ''}>
              <Badge tone={key === 'creator' ? 'amber' : 'neutral'}>
                {key === 'creator' ? 'Most loved' : key}
              </Badge>
              <h2 className="mt-6 text-2xl font-semibold">{name}</h2>
              <p className="mt-2 text-sm text-stone-500">{description}</p>
              <Button
                className="mt-8 w-full"
                variant={key === 'free' ? 'secondary' : 'primary'}
                disabled={key === 'free'}
                loading={checkout.isPending}
                onClick={() => key !== 'free' && checkout.mutate(key as 'creator' | 'studio')}
              >
                {key === 'free' ? 'Current plan' : 'Choose plan'}
              </Button>
            </Card>
          ))}
        </div>
        <Card className="mt-6">
          <h2 className="font-semibold">Credit balance</h2>
          <div className="mt-4">
            <CreditPill credits={0} />
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
export function SettingsPage() {
  const [name, setName] = useState('');
  const mutation = useMutation({
    mutationFn: () =>
      api('/api/me', { method: 'PATCH', body: JSON.stringify({ displayName: name }) }),
  });
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Header eyebrow="Your space" title="Settings" />
        <Card>
          <Label htmlFor="name">Display name</Label>
          <Input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="How should we call you?"
          />
          <Button className="mt-5" loading={mutation.isPending} onClick={() => mutation.mutate()}>
            Save changes
          </Button>
        </Card>
        <Card className="mt-5">
          <h2 className="font-semibold">Appearance</h2>
          <p className="mt-2 text-sm text-stone-500">
            Fakhm remembers your preferred atmosphere on this device.
          </p>
          <div className="mt-4">
            <ThemeToggle />
          </div>
        </Card>
        <Card className="mt-5 border-red-300/20">
          <h2 className="font-semibold text-red-200">Danger zone</h2>
          <p className="mt-2 text-sm text-stone-500">
            Permanently delete your account and stored files.
          </p>
          <Button className="mt-5" variant="danger">
            Delete account
          </Button>
        </Card>
      </div>
    </AppShell>
  );
}
export function NotificationsPage() {
  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: () =>
      api<{ items: Array<{ id: string; title: string; body: string; read_at: string | null }> }>(
        '/api/notifications',
      ),
  });
  const mark = useMutation({
    mutationFn: (all: boolean) =>
      api('/api/notifications', { method: 'PATCH', body: JSON.stringify({ all }) }),
  });
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Header eyebrow="Stay close" title="Notifications" />
        <div className="mb-5 flex justify-end">
          <Button variant="secondary" onClick={() => mark.mutate(true)}>
            Mark all read
          </Button>
        </div>
        <div className="space-y-3">
          {data?.items.map((item) => (
            <Card key={item.id} className={item.read_at ? 'opacity-60' : ''}>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-stone-500">{item.body}</p>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
export function AdminPage() {
  const { data } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api<{ users: number; generations: number; failed: number }>('/api/admin/stats'),
  });
  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Header eyebrow="Control room" title="Admin" />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Users', data?.users ?? 0],
            ['Generations', data?.generations ?? 0],
            ['Failed renders', data?.failed ?? 0],
          ].map(([label, value]) => (
            <Card key={String(label)}>
              <p className="text-xs uppercase tracking-widest text-stone-500">{label}</p>
              <p className="mt-3 text-4xl font-semibold text-amber">{String(value)}</p>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
export function GenerationPage({ id }: { id: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['generation', id],
    queryFn: () =>
      api<{
        generation: {
          title: string | null;
          status: GenerationStatus;
          progress: number;
          credits_charged: number;
          output_asset_id: string | null;
        };
      }>(`/api/generations/${id}`),
  });
  if (isLoading)
    return (
      <AppShell>
        <div className="p-10">
          <Skeleton className="h-96" />
        </div>
      </AppShell>
    );
  const generation = data?.generation;
  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Header eyebrow="Generation detail" title={generation?.title ?? 'Untitled render'} />
        {generation && (
          <>
            <JobCard status={generation.status} progress={generation.progress} />
            <Card className="mt-5">
              <h2 className="font-semibold">Render notes</h2>
              <p className="mt-2 text-sm text-stone-500">
                Credits charged: {generation.credits_charged}
              </p>
            </Card>
          </>
        )}
      </div>
    </AppShell>
  );
}

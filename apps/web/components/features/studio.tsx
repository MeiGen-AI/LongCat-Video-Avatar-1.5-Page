'use client';

import { Pause, Play, Upload, WandSparkles } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  FILE_CONSTRAINTS,
  estimateCredits,
  formatDuration,
  type GenerationStatus,
} from '@fakhm/shared';
import { Badge, Button, Card, CreditPill, Input, Label, Progress, Select, Slider } from '../ui';

export function FileDropzone({
  kind,
  onFile,
}: {
  kind: 'image' | 'audio';
  onFile: (file: File) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const constraint = FILE_CONSTRAINTS[kind];
  const validate = (file: File) => {
    if (!constraint.mime.includes(file.type as never))
      return setError(`Use a supported ${kind} file.`);
    if ('maxBytes' in constraint && file.size > constraint.maxBytes)
      return setError('That file is larger than the allowed limit.');
    setError('');
    onFile(file);
  };
  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') input.current?.click();
      }}
      onClick={() => input.current?.click()}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) validate(file);
      }}
      className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-amber/30 bg-amber/[.03] p-6 text-center transition hover:border-amber hover:bg-amber/[.06]"
    >
      <input
        ref={input}
        hidden
        type="file"
        accept={constraint.mime.join(',')}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) validate(file);
        }}
      />
      <Upload className="mb-3 text-amber" />
      <p className="text-sm font-medium">Drop your {kind} here</p>
      <p className="mt-1 text-xs text-stone-500">or choose a file · {constraint.mime.join(', ')}</p>
      {error && <p className="mt-3 text-xs text-red-300">{error}</p>}
    </div>
  );
}
export function ImageReferencePicker({
  file,
  onFile,
}: {
  file?: File;
  onFile: (file: File) => void;
}) {
  return (
    <div>
      <Label>Reference image</Label>
      {file ? (
        <div className="overflow-hidden rounded-xl border border-white/10">
          <Image
            unoptimized
            width={640}
            height={360}
            src={URL.createObjectURL(file)}
            alt="Reference preview"
            className="aspect-video w-full object-cover"
          />
          <p className="p-3 text-xs text-stone-400">{file.name}</p>
        </div>
      ) : (
        <FileDropzone kind="image" onFile={onFile} />
      )}
      <p className="mt-2 text-xs text-stone-600">
        Use a clear, front-facing image at least 512px wide.
      </p>
    </div>
  );
}
export function AudioWaveform({ file }: { file: File }) {
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = useState(0);
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <audio
        ref={audio}
        src={URL.createObjectURL(file)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onEnded={() => setPlaying(false)}
      />
      <div className="flex h-16 items-center gap-1">
        {Array.from({ length: 42 }, (_, index) => (
          <span
            key={index}
            className="w-1 rounded-full bg-violet-300/70"
            style={{ height: `${20 + ((index * 17) % 60)}%` }}
          />
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (playing) void audio.current?.pause();
            else void audio.current?.play();
            setPlaying(!playing);
          }}
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </Button>
        <span className="text-xs text-stone-400">{formatDuration(duration)}</span>
        <span className="truncate text-xs text-stone-600">{file.name}</span>
      </div>
    </div>
  );
}
export function AudioPicker({ file, onFile }: { file?: File; onFile: (file: File) => void }) {
  return (
    <div>
      <Label>Voice track</Label>
      {file ? <AudioWaveform file={file} /> : <FileDropzone kind="audio" onFile={onFile} />}
      <p className="mt-2 text-xs text-stone-600">MP3, WAV, M4A, or AAC · 1–60 seconds.</p>
    </div>
  );
}
export function ParamsPanel({
  duration,
  onChange,
}: {
  duration: number;
  onChange: (params: { resolution: string; fps: number; seed?: number; enhance: boolean }) => void;
}) {
  const [resolution, setResolution] = useState('720p');
  const [fps, setFps] = useState(30);
  const [enhance, setEnhance] = useState(true);
  const credits = estimateCredits(duration, resolution);
  useEffect(() => onChange({ resolution, fps, enhance }), [resolution, fps, enhance, onChange]);
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Render direction</h2>
        <CreditPill credits={credits} />
      </div>
      <div className="mt-5 space-y-5">
        <div>
          <Label>Resolution</Label>
          <Select value={resolution} onChange={(event) => setResolution(event.target.value)}>
            <option value="480p">480p · Draft</option>
            <option value="720p">720p · Balanced</option>
            <option value="1080p">1080p · Cinematic</option>
          </Select>
        </div>
        <div>
          <Label>Frame rate · {fps} fps</Label>
          <Slider
            min={24}
            max={60}
            step={1}
            value={fps}
            onChange={(event) => setFps(Number(event.target.value))}
          />
        </div>
        <label className="flex items-center justify-between text-sm text-stone-300">
          <span className="flex items-center gap-2">
            <WandSparkles size={16} className="text-amber" />
            Enhance expression
          </span>
          <input
            type="checkbox"
            checked={enhance}
            onChange={(event) => setEnhance(event.target.checked)}
            className="h-4 w-4 accent-amber"
          />
        </label>
      </div>
    </Card>
  );
}
export function JobCard({
  status,
  progress,
  title,
}: {
  status: GenerationStatus;
  progress: number;
  title?: string | null;
}) {
  const copy: Record<GenerationStatus, string> = {
    queued: 'Waiting in line',
    uploading: 'Preparing your files',
    validating: 'Checking the source',
    processing: 'Finding the rhythm',
    rendering: 'Painting the final frames',
    succeeded: 'Ready to share',
    failed: 'Needs another take',
    canceled: 'Canceled',
  };
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <Badge
            tone={status === 'succeeded' ? 'success' : status === 'failed' ? 'danger' : 'violet'}
          >
            {status}
          </Badge>
          <h3 className="mt-3 text-lg font-semibold">{title ?? 'Untitled generation'}</h3>
          <p className="mt-1 text-sm text-stone-500">{copy[status]}</p>
        </div>
        <span className="text-2xl font-semibold text-amber">{progress}%</span>
      </div>
      <div className="mt-5">
        <Progress value={progress} label="Render progress" />
      </div>
    </Card>
  );
}
export function VideoPlayer({
  src,
  poster,
  shareSlug,
}: {
  src?: string;
  poster?: string;
  shareSlug?: string | null;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
      <video controls poster={poster} className="aspect-video w-full" src={src}>
        <track kind="captions" />
      </video>
      <div className="flex justify-end gap-2 p-3">
        {src && (
          <a download href={src}>
            <Button size="sm" variant="secondary">
              Download
            </Button>
          </a>
        )}
        {shareSlug && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              navigator.clipboard.writeText(`${window.location.origin}/share/${shareSlug}`)
            }
          >
            Copy share link
          </Button>
        )}
      </div>
    </div>
  );
}

export function StatusTimeline({
  events,
}: {
  events: Array<{ status: string; progress: number; message: string | null; created_at: string }>;
}) {
  return (
    <motion.ol initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {events.map((event, index) => (
        <li key={`${event.status}-${event.created_at}`} className="flex gap-3">
          <span className="mt-1 h-2 w-2 rounded-full bg-amber" />
          <div>
            <p className="text-sm font-medium capitalize">{event.status}</p>
            <p className="text-xs text-stone-500">
              {event.message ?? 'Status updated'} ·{' '}
              {new Date(event.created_at).toLocaleTimeString()}
            </p>
          </div>
          {index === events.length - 1 && <Badge tone="violet">Current</Badge>}
        </li>
      ))}
    </motion.ol>
  );
}

export function PricingTable({ onChoose }: { onChoose?: (plan: 'creator' | 'studio') => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[
        ['free', 'Free', '60'],
        ['creator', 'Creator', '600'],
        ['studio', 'Studio', '2,400'],
      ].map(([key, name, credits]) => (
        <Card key={key}>
          <Badge tone={key === 'creator' ? 'amber' : 'neutral'}>{name}</Badge>
          <p className="mt-5 text-2xl font-semibold">{credits} credits</p>
          {key !== 'free' && (
            <Button className="mt-5 w-full" onClick={() => onChoose?.(key as 'creator' | 'studio')}>
              Choose {name}
            </Button>
          )}
        </Card>
      ))}
    </div>
  );
}

export function CreditLedgerTable({
  entries,
}: {
  entries: Array<{ reason: string; delta: number; created_at: string }>;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-stone-600">
            <th className="py-3">Reason</th>
            <th className="py-3">Credits</th>
            <th className="py-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={`${entry.created_at}-${entry.reason}`} className="border-b border-white/5">
              <td className="py-3 capitalize text-stone-300">
                {entry.reason.replaceAll('_', ' ')}
              </td>
              <td className={`py-3 ${entry.delta >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                {entry.delta > 0 ? '+' : ''}
                {entry.delta}
              </td>
              <td className="py-3 text-stone-500">
                {new Date(entry.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function NotificationList({
  items,
}: {
  items: Array<{ id: string; title: string; body: string; read_at: string | null }>;
}) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card key={item.id} className={item.read_at ? 'opacity-60' : ''}>
          <h3 className="font-semibold">{item.title}</h3>
          <p className="mt-1 text-sm text-stone-500">{item.body}</p>
        </Card>
      ))}
    </div>
  );
}

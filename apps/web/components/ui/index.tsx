'use client';

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Loader2,
  Moon,
  Sun,
  Upload,
  X,
} from 'lucide-react';
import Image from 'next/image';
import {
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from './utils';

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  loading,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary' && 'bg-amber text-ink hover:bg-[#f1c477]',
        variant === 'secondary' && 'border border-white/15 bg-white/5 hover:bg-white/10',
        variant === 'ghost' && 'text-stone-300 hover:bg-white/10',
        variant === 'danger' && 'bg-red-500/15 text-red-200 hover:bg-red-500/25',
        size === 'sm' && 'px-3 py-2 text-xs',
        size === 'lg' && 'px-6 py-3',
        size === 'md' && 'px-4 py-2.5',
        className,
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}
export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-xs font-semibold uppercase tracking-[.18em] text-stone-400"
    >
      {children}
    </label>
  );
}
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber/60 focus:ring-2 focus:ring-amber/20',
        className,
      )}
      {...props}
    />
  );
}
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'min-h-28 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm outline-none focus:border-amber/60 focus:ring-2 focus:ring-amber/20',
        props.className,
      )}
      {...props}
    />
  );
}
export function Select({
  children,
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        className={cn(
          'w-full appearance-none rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm outline-none focus:border-amber/60',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-3 text-stone-500"
      />
    </div>
  );
}
export function Switch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-6 w-11 rounded-full transition',
        checked ? 'bg-amber' : 'bg-white/15',
      )}
    >
      <span
        className={cn(
          'absolute top-1 h-4 w-4 rounded-full bg-white transition',
          checked ? 'left-6' : 'left-1',
        )}
      />
    </button>
  );
}
export function Slider(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="range" className={cn('w-full accent-amber', props.className)} {...props} />;
}
export function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-amber"
      />
      {label}
    </label>
  );
}
export function FieldError({ children }: { children?: ReactNode }) {
  return children ? (
    <p className="mt-1 flex items-center gap-1 text-xs text-red-300">
      <CircleAlert size={13} />
      {children}
    </p>
  ) : null;
}
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn('glass rounded-2xl p-5', className)}>{children}</section>;
}
export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'amber' | 'violet' | 'success' | 'danger';
}) {
  return (
    <span
      className={cn(
        'rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider',
        tone === 'amber' && 'bg-amber/15 text-amber',
        tone === 'violet' && 'bg-violet-400/15 text-violet-200',
        tone === 'success' && 'bg-emerald-400/15 text-emerald-200',
        tone === 'danger' && 'bg-red-400/15 text-red-200',
        tone === 'neutral' && 'bg-white/10 text-stone-300',
      )}
    >
      {children}
    </span>
  );
}
export function Progress({ value, label }: { value: number; label?: string }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-live="polite"
    >
      <div className="mb-1 flex justify-between text-xs text-stone-500">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber to-violet-400 transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-white/10', className)} />;
}
export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 p-8 text-center">
      <Upload className="mb-4 text-amber" />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-stone-500">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
export function ErrorState({ retry }: { retry?: () => void }) {
  return (
    <div className="rounded-2xl border border-red-300/20 bg-red-400/10 p-6 text-center text-sm text-red-100">
      <CircleAlert className="mx-auto mb-2" />
      <p>Something interrupted this view.</p>
      {retry && (
        <Button className="mt-4" variant="secondary" onClick={retry}>
          Try again
        </Button>
      )}
    </div>
  );
}
export function OfflineBanner() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const set = () => setOnline(navigator.onLine);
    set();
    window.addEventListener('online', set);
    window.addEventListener('offline', set);
    return () => {
      window.removeEventListener('online', set);
      window.removeEventListener('offline', set);
    };
  }, []);
  return online ? null : (
    <div className="fixed inset-x-0 top-0 z-50 bg-red-600 px-4 py-2 text-center text-sm">
      You are offline. Changes will resume when connected.
    </div>
  );
}
export function Pagination({
  page,
  total,
  limit,
  onChange,
}: {
  page: number;
  total: number;
  limit: number;
  onChange: (page: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / limit));
  return (
    <div className="flex items-center justify-center gap-3 py-5">
      <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        <ChevronLeft size={16} />
      </Button>
      <span className="text-xs text-stone-500">
        {page} / {pages}
      </span>
      <Button variant="ghost" size="sm" disabled={page >= pages} onClick={() => onChange(page + 1)}>
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}
export function Avatar({ name, src }: { name?: string | null; src?: string | null }) {
  return src ? (
    <Image
      unoptimized
      width={36}
      height={36}
      src={src}
      alt=""
      className="h-9 w-9 rounded-full object-cover"
    />
  ) : (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber/20 text-sm font-semibold text-amber">
      {(name ?? 'F').slice(0, 1).toUpperCase()}
    </div>
  );
}
export function CreditPill({ credits }: { credits: number }) {
  return <Badge tone="amber">{credits.toLocaleString()} credits</Badge>;
}
export function ThemeToggle() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('fakhm-theme', next ? 'dark' : 'light');
  };
  return (
    <Button aria-label="Toggle theme" variant="ghost" size="sm" onClick={toggle}>
      {dark ? <Sun size={17} /> : <Moon size={17} />}
    </Button>
  );
}
export function Dialog({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="glass max-h-[90vh] w-full max-w-lg overflow-auto rounded-2xl p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Button variant="ghost" size="sm" aria-label="Close" onClick={onClose}>
            <X size={17} />
          </Button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl border border-emerald-300/20 bg-[#181c1b] px-4 py-3 text-sm shadow-2xl">
      <CircleCheck size={17} className="text-emerald-300" />
      {message}
      <button onClick={onClose} aria-label="Close notification">
        <X size={15} />
      </button>
    </div>
  );
}
export function Toaster() {
  return null;
}
export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}) {
  return (
    <div className="flex gap-1 rounded-xl bg-white/5 p-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            'rounded-lg px-3 py-2 text-sm transition',
            tab === active ? 'bg-amber text-ink' : 'text-stone-400 hover:text-white',
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  return <span title={label}>{children}</span>;
}
export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  );
}
export function Sheet({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} title={title} onClose={onClose}>
      {children}
    </Dialog>
  );
}
export function DropdownMenu({ label, children }: { label: string; children: ReactNode }) {
  return (
    <details className="relative">
      <summary className="cursor-pointer list-none">{label}</summary>
      <div className="glass absolute right-0 z-10 mt-2 min-w-40 rounded-xl p-2">{children}</div>
    </details>
  );
}
export function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-8 text-center text-xs text-stone-600">
      © 2026 Fakhm Studio · Crafted for human stories.
    </footer>
  );
}

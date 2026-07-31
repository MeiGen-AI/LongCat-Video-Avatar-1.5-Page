export * from './api-client';
import { z } from 'zod';
export type { Database, Json } from './database.types';

export const GenerationStatus = z.enum([
  'queued',
  'uploading',
  'validating',
  'processing',
  'rendering',
  'succeeded',
  'failed',
  'canceled',
]);
export type GenerationStatus = z.infer<typeof GenerationStatus>;
export const ProviderStatus = z.enum([
  'queued',
  'processing',
  'rendering',
  'completed',
  'failed',
  'canceled',
]);
export type ProviderStatus = z.infer<typeof ProviderStatus>;
export function mapProviderStatus(status: ProviderStatus): GenerationStatus {
  if (status === 'completed') return 'succeeded';
  if (status === 'failed' || status === 'canceled') return status;
  if (status === 'queued') return 'queued';
  if (status === 'rendering') return 'rendering';
  return 'processing';
}
export const AssetKind = z.enum(['image', 'audio', 'video']);
export type AssetKind = z.infer<typeof AssetKind>;
export const SubscriptionStatus = z.enum([
  'trialing',
  'active',
  'past_due',
  'canceled',
  'incomplete',
  'paused',
]);
export type SubscriptionStatus = z.infer<typeof SubscriptionStatus>;
export const NotificationChannel = z.enum(['in_app', 'email', 'push']);
export type NotificationChannel = z.infer<typeof NotificationChannel>;

export interface Profile {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  locale: string;
  theme: 'dark' | 'light' | 'system';
  marketingOptIn: boolean;
  credits: number;
  role: 'user' | 'admin';
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface Plan {
  id: string;
  key: 'free' | 'creator' | 'studio';
  name: string;
  monthlyCredits: number;
  priceCents: number;
  priceEnvKey: string;
}
export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  provider: 'stripe' | 'revenuecat';
  providerCustomerId: string | null;
  providerSubscriptionId: string | null;
  status: SubscriptionStatus;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}
export interface CreditLedgerEntry {
  id: string;
  userId: string;
  delta: number;
  reason:
    | 'signup_bonus'
    | 'subscription_grant'
    | 'purchase'
    | 'generation_hold'
    | 'generation_refund'
    | 'admin_adjust';
  generationId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}
export interface Asset {
  id: string;
  userId: string;
  kind: AssetKind;
  bucket: string;
  path: string;
  mime: string;
  bytes: number;
  durationMs: number | null;
  width: number | null;
  height: number | null;
  checksum: string | null;
  createdAt: string;
}
export interface Generation {
  id: string;
  userId: string;
  imageAssetId: string;
  audioAssetId: string;
  outputAssetId: string | null;
  status: GenerationStatus;
  progress: number;
  providerJobId: string | null;
  provider: string | null;
  params: { resolution: string; fps: number; seed?: number; enhance: boolean };
  creditsCharged: number;
  errorCode: string | null;
  errorMessage: string | null;
  attempts: number;
  title: string | null;
  visibility: 'private' | 'unlisted';
  shareSlug: string | null;
  queuedAt: string;
  startedAt: string | null;
  completedAt: string | null;
  expiresAt: string | null;
}
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  generationId: string | null;
  channel: NotificationChannel;
  readAt: string | null;
  createdAt: string;
}
export interface AnalyticsEvent {
  userId: string | null;
  name: string;
  properties: Record<string, unknown>;
  sessionId: string | null;
  createdAt: string;
}

export const FILE_CONSTRAINTS = {
  image: {
    mime: ['image/png', 'image/jpeg', 'image/webp'] as const,
    maxBytes: 10 * 1024 * 1024,
    minWidth: 512,
    minHeight: 512,
  },
  audio: {
    mime: ['audio/mpeg', 'audio/wav', 'audio/x-m4a', 'audio/aac', 'audio/mp4'] as const,
    maxBytes: 25 * 1024 * 1024,
    minDurationMs: 1000,
    maxDurationMs: 60000,
  },
  video: { mime: ['video/mp4'] as const },
} as const;
export const CREDIT_COST_PER_SECOND = 2;
export const PLANS = {
  free: { key: 'free', monthlyCredits: 60, priceEnvKey: null, priceCents: 0 },
  creator: {
    key: 'creator',
    monthlyCredits: 600,
    priceEnvKey: 'STRIPE_PRICE_CREATOR',
    priceCents: 999,
  },
  studio: {
    key: 'studio',
    monthlyCredits: 2400,
    priceEnvKey: 'STRIPE_PRICE_STUDIO',
    priceCents: 2999,
  },
} as const;
export function estimateCredits(durationSeconds: number, resolution: string): number {
  const multiplier = resolution === '1080p' ? 2 : resolution === '720p' ? 1.25 : 1;
  return Math.max(1, Math.ceil(durationSeconds * CREDIT_COST_PER_SECOND * multiplier));
}
export function formatDuration(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, '0')}`;
}
export function formatCredits(credits: number): string {
  return new Intl.NumberFormat('en-US').format(credits);
}
const statusProgress: Record<GenerationStatus, number> = {
  queued: 5,
  uploading: 15,
  validating: 25,
  processing: 50,
  rendering: 80,
  succeeded: 100,
  failed: 100,
  canceled: 100,
};
export function progressForStatus(status: GenerationStatus, progress?: number): number {
  return progress ?? statusProgress[status];
}
export function isTerminalStatus(status: GenerationStatus): boolean {
  return ['succeeded', 'failed', 'canceled'].includes(status);
}
export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'RATE_LIMITED'
  | 'INSUFFICIENT_CREDITS'
  | 'UPSTREAM_ERROR'
  | 'INTERNAL_ERROR';
export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}
export const HTTP_STATUS: Record<ErrorCode, number> = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  RATE_LIMITED: 429,
  INSUFFICIENT_CREDITS: 402,
  UPSTREAM_ERROR: 502,
  INTERNAL_ERROR: 500,
};
export type Result<T> = { ok: true; data: T } | { ok: false; error: AppError };

const uuid = z.string().uuid();
export const createGenerationSchema = z.object({
  imageAssetId: uuid,
  audioAssetId: uuid,
  resolution: z.enum(['480p', '720p', '1080p']).default('720p'),
  fps: z.number().int().min(24).max(60).default(30),
  seed: z.number().int().optional(),
  enhance: z.boolean().default(true),
  title: z.string().max(100).optional(),
});
export const listGenerationsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  status: GenerationStatus.optional(),
});
export const generationIdSchema = z.object({ id: uuid });
export const cancelGenerationSchema = generationIdSchema;
export const retryGenerationSchema = generationIdSchema;
export const getGenerationSchema = generationIdSchema;
export const uploadSignRequestSchema = z.object({
  kind: AssetKind.extract(['image', 'audio']),
  mime: z.string(),
  bytes: z.number().int().positive(),
  filename: z.string().min(1).max(255),
  durationMs: z.number().int().positive().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});
export const profileUpdateSchema = z.object({
  displayName: z.string().max(80).optional(),
  locale: z.string().max(10).optional(),
  theme: z.enum(['dark', 'light', 'system']).optional(),
  marketingOptIn: z.boolean().optional(),
});
export const checkoutSessionSchema = z.object({ plan: z.enum(['creator', 'studio']) });
export const portalSessionSchema = z.object({});
export const notificationsMarkReadSchema = z.object({ ids: z.array(uuid).min(1) });
export const adminStatsSchema = z.object({});
export type CreateGenerationInput = z.infer<typeof createGenerationSchema>;
export const shareToggleSchema = z.object({ shared: z.boolean() });
export const notificationUpdateSchema = z
  .object({ ids: z.array(uuid).optional(), all: z.boolean().optional() })
  .refine((v) => Boolean(v.all || v.ids?.length), 'ids or all is required');
export const analyticsEventSchema = z.object({
  name: z.string().min(1).max(100),
  properties: z.record(z.unknown()).default({}),
  sessionId: z.string().max(200).optional(),
});
export const webhookJobSchema = z.object({
  id: z.string().min(1),
  status: ProviderStatus,
  event_id: z.string().min(1),
  progress: z.number().int().min(0).max(100).optional(),
  video_url: z.string().url().optional(),
  error: z.string().optional(),
});
export function createShareSlug(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
export function rateLimitKey(userId: string | undefined, ip: string): string {
  return userId ? `user:${userId}` : `ip:${ip}`;
}

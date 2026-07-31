import { AppError } from '@fakhm/shared';
import { getEnv } from './env';
type Job = { id: string; status: string; progress?: number; video_url?: string; error?: string };
async function request(path: string, init: RequestInit = {}): Promise<Job> {
  const env = getEnv();
  if (!env.LONGCAT_API_KEY) throw new AppError('UPSTREAM_ERROR', 'LongCat is not configured');
  let last: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(`${env.LONGCAT_API_URL}${path}`, {
        ...init,
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${env.LONGCAT_API_KEY}`,
          ...init.headers,
        },
        signal: AbortSignal.timeout(30000),
      });
      if (response.ok) return (await response.json()) as Job;
      last = new Error(`LongCat request failed (${response.status})`);
    } catch (error) {
      last = error;
    }
    if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 250 * 2 ** attempt));
  }
  throw new AppError(
    'UPSTREAM_ERROR',
    last instanceof Error ? last.message : 'LongCat request failed',
  );
}
export function submitJob(payload: Record<string, unknown>) {
  return request('/jobs', { method: 'POST', body: JSON.stringify(payload) });
}
export function getJob(id: string) {
  return request(`/jobs/${encodeURIComponent(id)}`);
}
export function cancelJob(id: string) {
  return request(`/jobs/${encodeURIComponent(id)}/cancel`, { method: 'POST' });
}
export async function verifyWebhookSignature(body: string, signature: string) {
  const secret = getEnv().LONGCAT_WEBHOOK_SECRET;
  if (!secret) return false;
  const crypto = await import('node:crypto');
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
  const received = signature.replace(/^sha256=/, '');
  return (
    received.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received))
  );
}

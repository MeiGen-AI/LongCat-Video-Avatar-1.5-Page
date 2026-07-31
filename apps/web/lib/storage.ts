import { AppError } from '@fakhm/shared';
import { createAdmin } from './supabase/admin';
import { getEnv } from './env';
export function assetPath(userId: string, assetId: string, ext: string) {
  return `${userId}/${assetId}.${ext.replace(/^\./, '').toLowerCase()}`;
}
export async function signedUpload(bucket: string, path: string) {
  const { data, error } = await createAdmin().storage.from(bucket).createSignedUploadUrl(path);
  if (error || !data)
    throw new AppError('UPSTREAM_ERROR', error?.message ?? 'Unable to sign upload');
  return data;
}
export async function signedDownload(bucket: string, path: string, expires = 3600) {
  const { data, error } = await createAdmin().storage.from(bucket).createSignedUrl(path, expires);
  if (error || !data)
    throw new AppError('UPSTREAM_ERROR', error?.message ?? 'Unable to sign download');
  return data.signedUrl;
}
export async function copyOutput(url: string, path: string) {
  if (!isAllowedOutputUrl(url))
    throw new AppError('VALIDATION_ERROR', 'Provider output URL is not allowed');
  const response = await fetch(url);
  if (!response.ok) throw new AppError('UPSTREAM_ERROR', 'Unable to download provider output');
  const bytes = await response.arrayBuffer();
  const { error } = await createAdmin()
    .storage.from('outputs')
    .upload(path, bytes, { contentType: 'video/mp4', upsert: true });
  if (error) throw new AppError('UPSTREAM_ERROR', error.message);
  return path;
}
export function isAllowedOutputUrl(value: string) {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return false;
  }
  if (parsed.protocol !== 'https:') return false;
  const env = getEnv();
  const apiHost = new URL(env.LONGCAT_API_URL).hostname;
  const allowed = (env.LONGCAT_OUTPUT_HOSTS ?? apiHost)
    .split(',')
    .map((host) => host.trim())
    .filter(Boolean);
  if (!allowed.includes(parsed.hostname)) return false;
  const host = parsed.hostname.toLowerCase();
  if (
    host === 'localhost' ||
    host === 'ip6-localhost' ||
    host === '::1' ||
    host.startsWith('127.') ||
    host.startsWith('10.') ||
    host.startsWith('192.168.')
  )
    return false;
  const octets = host.split('.').map(Number);
  if (
    octets.length === 4 &&
    (((octets[0] ?? 0) === 172 && (octets[1] ?? 0) >= 16 && (octets[1] ?? 0) <= 31) ||
      ((octets[0] ?? 0) === 169 && (octets[1] ?? 0) === 254))
  )
    return false;
  return true;
}

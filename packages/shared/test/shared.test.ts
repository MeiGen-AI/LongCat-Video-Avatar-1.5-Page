import { describe, expect, it } from 'vitest';
import {
  createGenerationSchema,
  createShareSlug,
  estimateCredits,
  formatDuration,
  isTerminalStatus,
  rateLimitKey,
  webhookJobSchema,
} from '../src';
describe('shared helpers', () => {
  it('estimates credits', () => expect(estimateCredits(10, '720p')).toBe(25));
  it('formats duration', () => expect(formatDuration(65)).toBe('1:05'));
  it('knows terminal statuses', () => expect(isTerminalStatus('succeeded')).toBe(true));
  it('validates generation input', () =>
    expect(() => createGenerationSchema.parse({ imageAssetId: 'bad' })).toThrow());
});
describe('backend pure logic', () => {
  it('handles credit edge cases', () => {
    expect(estimateCredits(0, '480p')).toBe(1);
    expect(estimateCredits(1, '1080p')).toBe(4);
  });
  it('creates share slugs', () => expect(createShareSlug()).toMatch(/^[a-z0-9-]+$/));
  it('builds scoped rate-limit keys', () => {
    expect(rateLimitKey('user-1', '127.0.0.1')).toBe('user:user-1');
    expect(rateLimitKey(undefined, '127.0.0.1')).toBe('ip:127.0.0.1');
  });
  it('parses provider payloads', () =>
    expect(
      webhookJobSchema.parse({
        id: 'job',
        event_id: 'delivery-1',
        status: 'processing',
        progress: 40,
      }).progress,
    ).toBe(40));
});

import { describe, expect, it, vi } from 'vitest';
import { createApiClient, createGenerationSchema } from '../src';

describe('createApiClient', () => {
  it('adds the bearer token and returns JSON', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    const client = createApiClient(fetcher, 'https://example.test', async () => 'token');
    await expect(client.request<{ ok: boolean }>('/health')).resolves.toEqual({ ok: true });
    expect(fetcher).toHaveBeenCalledWith(
      'https://example.test/health',
      expect.objectContaining({
        headers: expect.objectContaining({ authorization: 'Bearer token' }),
      }),
    );
  });
  it('surfaces API errors', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ error: { message: 'Nope' } }), { status: 400 }),
      );
    await expect(
      createApiClient(fetcher, '', async () => undefined).request('/bad'),
    ).rejects.toThrow('Nope');
  });
});

describe('generation schema', () => {
  it('accepts valid generation parameters and rejects missing assets', () => {
    expect(
      createGenerationSchema.safeParse({
        imageAssetId: crypto.randomUUID(),
        audioAssetId: crypto.randomUUID(),
      }).success,
    ).toBe(true);
    expect(
      createGenerationSchema.safeParse({
        imageAssetId: 'not-an-id',
        audioAssetId: crypto.randomUUID(),
      }).success,
    ).toBe(false);
  });
});

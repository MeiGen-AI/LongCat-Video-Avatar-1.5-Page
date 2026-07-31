import { describe, expect, it } from 'vitest';
import { isAllowedOutputUrl } from './storage';

describe('provider output URL validation', () => {
  it('requires HTTPS and an allowed provider host', () => {
    const original = process.env.LONGCAT_OUTPUT_HOSTS;
    process.env.LONGCAT_OUTPUT_HOSTS = 'cdn.longcat.video';
    expect(isAllowedOutputUrl('https://cdn.longcat.video/output.mp4')).toBe(true);
    expect(isAllowedOutputUrl('http://cdn.longcat.video/output.mp4')).toBe(false);
    expect(isAllowedOutputUrl('https://attacker.example/output.mp4')).toBe(false);
    process.env.LONGCAT_OUTPUT_HOSTS = original;
  });
});

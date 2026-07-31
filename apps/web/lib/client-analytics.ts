'use client';

export function trackClientEvent(name: string, properties: Record<string, unknown> = {}) {
  void fetch('/api/analytics', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name, properties }),
    keepalive: true,
  });
}

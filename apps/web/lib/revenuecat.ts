import { AppError } from '@fakhm/shared';
export function verifyRevenueCat(request: Request) {
  const expected = process.env.REVENUECAT_WEBHOOK_SECRET;
  return Boolean(expected && request.headers.get('authorization') === `Bearer ${expected}`);
}
export function planFromEntitlement(id: string): 'free' | 'creator' | 'studio' | null {
  const value = id.toLowerCase();
  if (value.includes('studio')) return 'studio';
  if (value.includes('creator')) return 'creator';
  return null;
}

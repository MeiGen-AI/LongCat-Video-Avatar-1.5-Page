import Stripe from 'stripe';
import { getEnv } from './env';
let client: Stripe | undefined;
export function stripe() {
  if (!client) {
    const key = getEnv().STRIPE_SECRET_KEY;
    if (!key) throw new Error('Stripe is not configured');
    client = new Stripe(key, { apiVersion: '2024-06-20' });
  }
  return client;
}
export function planPrice(plan: 'creator' | 'studio') {
  const env = getEnv();
  return plan === 'creator' ? env.STRIPE_PRICE_CREATOR : env.STRIPE_PRICE_STUDIO;
}

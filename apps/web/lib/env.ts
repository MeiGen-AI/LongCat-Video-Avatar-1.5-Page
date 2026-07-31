import { z } from 'zod';
const schema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  LONGCAT_API_URL: z.string().url().default('https://api.longcat.video/v1'),
  LONGCAT_API_KEY: z.string().optional(),
  LONGCAT_WEBHOOK_SECRET: z.string().optional(),
  LONGCAT_OUTPUT_HOSTS: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  MOBILE_ORIGIN: z.string().url().optional(),
  CRON_SECRET: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_CREATOR: z.string().optional(),
  STRIPE_PRICE_STUDIO: z.string().optional(),
  REVENUECAT_WEBHOOK_SECRET: z.string().optional(),
});
export function getEnv() {
  return schema.parse(process.env);
}

## Mobile app

The Expo SDK 51 mobile workspace lives in `apps/mobile`. Copy
`apps/mobile/.env.example` to your local Expo environment, then run:

```bash
npm install
npm run dev:mobile
```

The app uses Expo Router, Supabase persisted sessions, signed uploads to the
web API, React Query polling, Expo media pickers, and RevenueCat purchase
entitlements. Native builds use the bundle/package identifier
`com.fakhmstudio.app` and the deep-link scheme `fakhmstudio`.

# Fakhm Studio

Fakhm Studio turns one reference image and one audio file into a lip-synced avatar video with LongCat-Video-Avatar 1.5.

## Architecture

`@fakhm/shared` is the strict domain and validation library. `@fakhm/web` is a Next.js 14 App Router application. Supabase provides auth, Postgres, storage, and RLS. Stripe and RevenueCat provide billing. LongCat rendering is isolated behind the provider client and webhook handlers.

## Setup

Use Node 20 and npm 10. Copy `.env.example` to `.env.local`, fill Supabase values, then run `npm install` and `npm run dev`. Apply migrations with `supabase db push`; never expose the service role key to browsers.

## Supabase and billing

Create a Supabase project, enable email/Google/Apple auth, configure `/auth/callback`, and apply migrations in order. Create Stripe recurring prices and set `STRIPE_PRICE_CREATOR`/`STRIPE_PRICE_STUDIO`; register `/api/webhooks/stripe`. Configure RevenueCat to call `/api/webhooks/revenuecat` with its shared secret. Set production redirect URLs and webhook secrets in Vercel.

## LongCat contract

The isolated client sends `POST /jobs` with `{image_url,audio_url,resolution,fps,seed,enhance}`, receives `{id,status}`, polls `GET /jobs/:id` for `{id,status,progress,video_url,error}`, and cancels via `POST /jobs/:id/cancel`. Webhooks provide job ID, status, progress, and output URL and are signed with `LONGCAT_WEBHOOK_SECRET`.

## Deployment

Deploy the repository root to Vercel. `vercel.json` runs the workspace build, allows long-running API functions, and schedules daily cleanup at `/api/cron/cleanup`. Add all variables in `.env.example`, then configure provider callbacks to the production URL.

## Commands

`npm run dev`, `npm run typecheck`, `npm run lint`, `npm run build`, and `npm run test`.

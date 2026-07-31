export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
type Row<T> = { Row: T; Insert: Partial<T>; Update: Partial<T>; Relationships: [] };
export type Database = {
  public: {
    Tables: {
      profiles: Row<{
        id: string;
        email: string;
        display_name: string | null;
        avatar_url: string | null;
        locale: string;
        theme: string;
        marketing_opt_in: boolean;
        credits: number;
        role: 'user' | 'admin';
        onboarding_completed: boolean;
        created_at: string;
        updated_at: string;
      }>;
      plans: Row<{
        id: string;
        key: string;
        name: string;
        monthly_credits: number;
        price_cents: number;
        price_env_key: string | null;
      }>;
      subscriptions: Row<{
        id: string;
        user_id: string;
        plan_id: string;
        provider: 'stripe' | 'revenuecat';
        provider_customer_id: string | null;
        provider_subscription_id: string | null;
        status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete' | 'paused';
        current_period_end: string | null;
        cancel_at_period_end: boolean;
        created_at: string;
        updated_at: string;
      }>;
      credit_ledger: Row<{
        id: string;
        user_id: string;
        delta: number;
        reason:
          | 'signup_bonus'
          | 'subscription_grant'
          | 'purchase'
          | 'generation_hold'
          | 'generation_refund'
          | 'admin_adjust';
        generation_id: string | null;
        metadata: Json;
        created_at: string;
      }>;
      assets: Row<{
        id: string;
        user_id: string;
        kind: 'image' | 'audio' | 'video';
        bucket: string;
        path: string;
        mime: string;
        bytes: number;
        duration_ms: number | null;
        width: number | null;
        height: number | null;
        checksum: string | null;
        created_at: string;
      }>;
      generations: Row<{
        id: string;
        user_id: string;
        image_asset_id: string;
        audio_asset_id: string;
        output_asset_id: string | null;
        status:
          | 'queued'
          | 'uploading'
          | 'validating'
          | 'processing'
          | 'rendering'
          | 'succeeded'
          | 'failed'
          | 'canceled';
        progress: number;
        provider_job_id: string | null;
        provider: string | null;
        params: Json;
        credits_charged: number;
        error_code: string | null;
        error_message: string | null;
        attempts: number;
        queued_at: string;
        started_at: string | null;
        completed_at: string | null;
        expires_at: string | null;
        title: string | null;
        visibility: 'private' | 'unlisted';
        share_slug: string | null;
      }>;
      generation_events: Row<{
        id: string;
        generation_id: string;
        status:
          | 'queued'
          | 'uploading'
          | 'validating'
          | 'processing'
          | 'rendering'
          | 'succeeded'
          | 'failed'
          | 'canceled';
        progress: number;
        message: string | null;
        created_at: string;
      }>;
      notifications: Row<{
        id: string;
        user_id: string;
        type: string;
        title: string;
        body: string;
        generation_id: string | null;
        read_at: string | null;
        created_at: string;
      }>;
      analytics_events: Row<{
        id: string;
        user_id: string | null;
        name: string;
        properties: Json;
        session_id: string | null;
        created_at: string;
      }>;
      webhook_events: Row<{
        id: string;
        provider: string;
        external_id: string;
        payload: Json;
        processed_at: string | null;
      }>;
      rate_limit_hits: Row<{ key: string; window_start: string; count: number }>;
    };
    Views: { [_ in never]: never };
    Functions: {
      deduct_credits: {
        Args: { p_user: string; p_amount: number; p_generation: string };
        Returns: undefined;
      };
      bump_rate_limit: {
        Args: { p_key: string; p_window: number; p_limit: number };
        Returns: { allowed: boolean; remaining: number }[];
      };
      cleanup_expired_assets: { Args: Record<string, never>; Returns: undefined };
    };
    Enums: {
      app_role: 'user' | 'admin';
      asset_kind: 'image' | 'audio' | 'video';
      generation_status:
        | 'queued'
        | 'uploading'
        | 'validating'
        | 'processing'
        | 'rendering'
        | 'succeeded'
        | 'failed'
        | 'canceled';
      subscription_status:
        | 'trialing'
        | 'active'
        | 'past_due'
        | 'canceled'
        | 'incomplete'
        | 'paused';
      ledger_reason:
        | 'signup_bonus'
        | 'subscription_grant'
        | 'purchase'
        | 'generation_hold'
        | 'generation_refund'
        | 'admin_adjust';
    };
    CompositeTypes: { [_ in never]: never };
  };
};

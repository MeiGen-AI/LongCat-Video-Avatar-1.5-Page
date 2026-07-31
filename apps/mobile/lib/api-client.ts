import { createApiClient, type CreateGenerationInput } from '@fakhm/shared';
import { config } from './config';
import { supabase } from './supabase';

export type ApiClient = {
  me: () => Promise<unknown>;
  listGenerations: (query?: string) => Promise<unknown>;
  getGeneration: (id: string) => Promise<unknown>;
  createGeneration: (input: CreateGenerationInput) => Promise<{ id: string }>;
  signUpload: (input: {
    kind: 'image' | 'audio';
    mime: string;
    bytes: number;
    filename: string;
    durationMs?: number;
    width?: number;
    height?: number;
  }) => Promise<{ assetId: string; uploadUrl: string; path: string }>;
  notifications: () => Promise<unknown>;
  deleteAccount: () => Promise<unknown>;
};

const client = createApiClient(fetch, config.apiUrl, async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
});

export const api: ApiClient = {
  me: () => client.request('/api/me'),
  listGenerations: (query = '') => client.request(`/api/generations${query}`),
  getGeneration: (id) => client.request(`/api/generations/${id}`),
  createGeneration: (input) =>
    client.request('/api/generations', { method: 'POST', body: JSON.stringify(input) }),
  signUpload: (input) =>
    client.request('/api/uploads/sign', { method: 'POST', body: JSON.stringify(input) }),
  notifications: () => client.request('/api/notifications'),
  deleteAccount: () => client.request('/api/me/delete', { method: 'DELETE' }),
};

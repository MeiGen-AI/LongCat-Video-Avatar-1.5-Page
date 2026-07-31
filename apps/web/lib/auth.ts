import { AppError } from '@fakhm/shared';
import { createClient } from './supabase/server';
export async function getSession() {
  const { data, error } = await createClient().auth.getSession();
  if (error) throw new AppError('UNAUTHORIZED', error.message);
  return data.session;
}
export async function getUser() {
  const { data, error } = await createClient().auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}
export async function requireUser() {
  const user = await getUser();
  if (!user) throw new AppError('UNAUTHORIZED', 'Authentication required');
  return user;
}
export async function requireAdmin() {
  const user = await requireUser();
  const { data, error } = await createClient()
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  const role = (data as { role?: string } | null)?.role;
  if (error || role !== 'admin') throw new AppError('FORBIDDEN', 'Administrator access required');
  return user;
}

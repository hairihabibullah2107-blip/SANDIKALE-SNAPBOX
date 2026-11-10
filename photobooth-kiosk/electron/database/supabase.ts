import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../main/config';

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!config.SUPABASE_URL || !config.SUPABASE_SERVICE_KEY) return null;
  client ??= createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false },
  });
  return client;
}

export async function dbHealth(): Promise<{ ok: boolean; detail: string }> {
  const sb = getSupabase();
  if (!sb) return { ok: false, detail: 'Supabase belum dikonfigurasi (.env)' };
  const { error } = await sb.from('sessions').select('id', { head: true, count: 'exact' }).limit(1);
  return error ? { ok: false, detail: error.message } : { ok: true, detail: 'terhubung' };
}

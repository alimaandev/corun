import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (!_client) {
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY
    if (!url || !key) {
      throw new Error('VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set')
    }
    _client = createClient(url, key, {
      auth: { persistSession: true, storage: localStorage },
    })
  }
  return _client
}

export function getSupabase(): SupabaseClient {
  return getClient()
}

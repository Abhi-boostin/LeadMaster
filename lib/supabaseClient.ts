import { createRouteHandlerClient, createServerComponentClient, createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export function getSupabaseServerClient() {
  return createRouteHandlerClient({ cookies })
}

export function getSupabaseServerComponentClient() {
  return createServerComponentClient({ cookies })
} 

export function getSupabaseActionClient() {
  return createServerActionClient({ cookies })
}

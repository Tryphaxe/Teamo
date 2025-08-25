import { createBrowserClient } from "@supabase/ssr"
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const create = () => createBrowserClient(supabaseUrl, supabaseKey)

export const supabase = createClient(supabaseUrl, supabaseKey);
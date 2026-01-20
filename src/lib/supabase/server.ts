import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';
import type { RequestEvent } from '@sveltejs/kit';

export function createSupabaseServerClient(event: RequestEvent) {
	const supabaseUrl = env.PUBLIC_SUPABASE_URL
	const supabaseAnonKey = env.PUBLIC_SUPABASE_ANON_KEY
	
	return createClient(supabaseUrl, supabaseAnonKey, {
		global: {
			headers: {
				Authorization: event.request.headers.get('Authorization') || ''
			}
		}
	});
}


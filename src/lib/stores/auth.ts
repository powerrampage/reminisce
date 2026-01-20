import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { browser } from '$app/environment';

interface AuthState {
	user: User | null;
	session: Session | null;
	loading: boolean;
	initialized: boolean;
}

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>({
		user: null,
		session: null,
		loading: true,
		initialized: false
	});

	// Initialize auth state
	if (browser) {
		// Get initial session
		supabase.auth.getSession().then(({ data: { session } }) => {
			update((state) => ({
				...state,
				user: session?.user ?? null,
				session,
				loading: false,
				initialized: true
			}));
		});

		// Listen for auth changes
		supabase.auth.onAuthStateChange((_event, session) => {
			update((state) => ({
				...state,
				user: session?.user ?? null,
				session,
				loading: false,
				initialized: true
			}));
		});
	}

	return {
		subscribe,
		signIn: async (email: string, password: string) => {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password
			});
			if (error) throw error;
			return data;
		},
		signUp: async (email: string, password: string) => {
			const { data, error } = await supabase.auth.signUp({
				email,
				password
			});
			if (error) throw error;
			return data;
		},
		signOut: async () => {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
		},
		resetPassword: async (email: string) => {
			if (!browser) throw new Error('resetPassword can only be called in the browser');
			const { error } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: `${window.location.origin}/reset-password`
			});
			if (error) throw error;
		},
		updatePassword: async (password: string) => {
			const { error } = await supabase.auth.updateUser({ password });
			if (error) throw error;
		}
	};
}

export const authStore = createAuthStore();


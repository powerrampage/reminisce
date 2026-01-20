import { supabase } from '$lib/supabase/client';
import { authStore } from '$lib/stores/auth';
import { get } from 'svelte/store';
import type { SavedWord } from '$lib/stores/words';

export interface SavedWordRow {
	id: string;
	user_id: string;
	word: string;
	created_at: string;
}

/**
 * Get the current user ID from the auth store (no network request)
 */
function getCurrentUserId(): string | null {
	const auth = get(authStore);
	return auth.user?.id ?? null;
}

export const savedWordsService = {
	/**
	 * Get all saved words for the current user
	 */
	async getAll(): Promise<SavedWord[]> {
		const userId = getCurrentUserId();
		if (!userId) return [];

		const { data, error } = await supabase
			.from('saved_words')
			.select('word, created_at')
			.eq('user_id', userId)
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Error fetching saved words:', error);
			throw error;
		}

		return (data || []).map((row) => ({ word: row.word }));
	},

	/**
	 * Check if a word is saved for the current user
	 */
	async isSaved(word: string): Promise<boolean> {
		const userId = getCurrentUserId();
		if (!userId) return false;

		const { data, error } = await supabase
			.from('saved_words')
			.select('id')
			.eq('user_id', userId)
			.eq('word', word.toLowerCase())
			.single();

		if (error && error.code !== 'PGRST116') {
			// PGRST116 is "not found" which is fine
			console.error('Error checking saved word:', error);
			return false;
		}

		return !!data;
	},

	/**
	 * Save a word for the current user
	 */
	async save(word: string): Promise<void> {
		const userId = getCurrentUserId();
		if (!userId) {
			throw new Error('User must be authenticated to save words');
		}

		const normalizedWord = word.toLowerCase().trim();
		if (!normalizedWord) {
			throw new Error('Word cannot be empty');
		}

		// Check if already saved
		const isAlreadySaved = await this.isSaved(normalizedWord);
		if (isAlreadySaved) {
			return; // Already saved, no-op
		}

		const { error } = await supabase.from('saved_words').insert({
			user_id: userId,
			word: normalizedWord
		});

		if (error) {
			console.error('Error saving word:', error);
			throw error;
		}
	},

	/**
	 * Remove a saved word for the current user
	 */
	async remove(word: string): Promise<void> {
		const userId = getCurrentUserId();
		if (!userId) {
			throw new Error('User must be authenticated to remove words');
		}

		const normalizedWord = word.toLowerCase().trim();
		const { error } = await supabase
			.from('saved_words')
			.delete()
			.eq('user_id', userId)
			.eq('word', normalizedWord);

		if (error) {
			console.error('Error removing word:', error);
			throw error;
		}
	},

	/**
	 * Clear all saved words for the current user
	 */
	async clear(): Promise<void> {
		const userId = getCurrentUserId();
		if (!userId) {
			throw new Error('User must be authenticated to clear words');
		}

		const { error } = await supabase.from('saved_words').delete().eq('user_id', userId);

		if (error) {
			console.error('Error clearing words:', error);
			throw error;
		}
	}
};


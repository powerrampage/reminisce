import { debounce } from './debounce';

class Storage {
	private debouncedWrite: ReturnType<typeof debounce>;

	constructor() {
		this.debouncedWrite = debounce((key: string, value: string) => {
			try {
				localStorage.setItem(key, value);
			} catch (error) {
				console.error('Failed to write to localStorage:', error);
			}
		}, 500);
	}

	get<T>(key: string): T | null {
		if (typeof window === 'undefined' || !window.localStorage) {
			return null;
		}
		try {
			const item = localStorage.getItem(key);
			if (item === null) return null;
			return JSON.parse(item) as T;
		} catch (error) {
			console.error('Failed to read from localStorage:', error);
			return null;
		}
	}

	set<T>(key: string, value: T): void {
		if (typeof window === 'undefined' || !window.localStorage) {
			return;
		}
		try {
			const serialized = JSON.stringify(value);
			this.debouncedWrite(key, serialized);
		} catch (error) {
			console.error('Failed to serialize value:', error);
		}
	}

	remove(key: string): void {
		if (typeof window === 'undefined' || !window.localStorage) {
			return;
		}
		try {
			localStorage.removeItem(key);
		} catch (error) {
			console.error('Failed to remove from localStorage:', error);
		}
	}

	clear(): void {
		if (typeof window === 'undefined' || !window.localStorage) {
			return;
		}
		try {
			localStorage.clear();
		} catch (error) {
			console.error('Failed to clear localStorage:', error);
		}
	}
}

export const storage = new Storage();

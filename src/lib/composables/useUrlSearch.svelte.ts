import { page } from '$app/stores';
import { goto } from '$app/navigation';
import { get } from 'svelte/store';

export function useUrlSearch(paramName: string = 'q') {
	function getSearchParam(): string | null {
		const pageValue = get(page);
		return pageValue.url.searchParams.get(paramName);
	}

	function setSearchParam(value: string): void {
		const pageValue = get(page);
		const trimmedValue = value.trim();
		const currentParams = pageValue.url.searchParams;
		
		const params: string[] = [];
		for (const [key, val] of currentParams.entries()) {
			if (key !== paramName) {
				params.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
			}
		}
		if (trimmedValue) {
			params.push(`${encodeURIComponent(paramName)}=${encodeURIComponent(trimmedValue)}`);
		}
		
		const queryString = params.length > 0 ? `?${params.join('&')}` : '';
		const newUrl = `${pageValue.url.pathname}${queryString}${pageValue.url.hash}`;
		// eslint-disable-next-line -- goto() works with full URL paths constructed from page.url
		goto(newUrl, { replaceState: true, noScroll: true });
	}

	return {
		getSearchParam,
		setSearchParam
	};
}


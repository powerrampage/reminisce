export interface KeyboardNavigationHandlers {
	onFlip?: () => void;
	onNext?: () => void;
	onPrevious?: () => void;
}

export function createKeyboardHandler(handlers: KeyboardNavigationHandlers) {
	return (e: KeyboardEvent) => {
		if (
			e.target instanceof HTMLInputElement ||
			e.target instanceof HTMLTextAreaElement ||
			(e.target instanceof HTMLElement && e.target.isContentEditable)
		) {
			return;
		}

		switch (e.key) {
			case ' ':
			case 'Enter':
				e.preventDefault();
				handlers.onFlip?.();
				break;
			case 'ArrowRight':
				e.preventDefault();
				handlers.onNext?.();
				break;
			case 'ArrowLeft':
				e.preventDefault();
				handlers.onPrevious?.();
				break;
		}
	};
}


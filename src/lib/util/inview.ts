import type { Options } from '$lib/types';

const defaultOptions: Options = {
	root: null,
	rootMargin: '0px',
	threshold: 0,
	unobserveOnEnter: false
};

export function inview(node: HTMLElement, options: Options = {}) {
	const { root, rootMargin, threshold, unobserveOnEnter, onChange, onEnter, onLeave }: Options = {
		...defaultOptions,
		...options
	};

	let currentInView: boolean | undefined;
	let observer: IntersectionObserver | null = null;

	if (typeof IntersectionObserver === 'undefined') {
		// keep content visible when the observer API is unavailable
		onChange?.({ inView: true, node });
		onEnter?.({ inView: true, node });
		return;
	}

	function emit(inView: boolean) {
		if (currentInView === inView) return;
		currentInView = inView;

		const detail = { inView, node };
		onChange?.(detail);

		if (inView) {
			onEnter?.(detail);
			if (unobserveOnEnter) cleanup();
		} else {
			onLeave?.(detail);
		}
	}

	function cleanup() {
		observer?.disconnect();
		observer = null;
	}

	observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) emit(entry.isIntersecting);
		},
		{ root, rootMargin, threshold }
	);

	observer.observe(node);

	return {
		destroy: cleanup
	};
}

import type {
	Options,
	Position,
	ScrollDirection,
	ObserverEventDetails,
	LifecycleEventDetails
} from '$lib/types';

const defaultOptions: Options = {
	root: null,
	rootMargin: '0px',
	threshold: 0,
	unobserveOnEnter: false
};

function parseRootMargin(rootMargin: string) {
	const values = rootMargin
		.trim()
		.split(/\s+/)
		.filter(Boolean)
		.map((value) => Number.parseFloat(value) || 0);

	const [top, right = top, bottom = top, left = right] =
		values.length === 4
			? values
			: values.length === 3
				? [values[0], values[1], values[2], values[1]]
				: values.length === 2
					? [values[0], values[1], values[0], values[1]]
					: [values[0] ?? 0];

	return { top, right, bottom, left };
}

function getFallbackEntry(node: HTMLElement, inView: boolean): IntersectionObserverEntry {
	const rect = node.getBoundingClientRect();
	const emptyRect = new DOMRectReadOnly(0, 0, 0, 0);

	return {
		time: performance.now(),
		target: node,
		rootBounds: null,
		boundingClientRect: rect,
		intersectionRect: inView ? rect : emptyRect,
		isIntersecting: inView,
		intersectionRatio: inView ? 1 : 0
	} as IntersectionObserverEntry;
}

export function inview(node: HTMLElement, options: Options = {}) {
	const {
		root,
		rootMargin,
		threshold,
		unobserveOnEnter,
		onChange,
		onEnter,
		onLeave,
		onInit
	}: Options = {
		...defaultOptions,
		...options
	};
	const rootMarginValues = parseRootMargin(rootMargin ?? '0px');

	let prevPos: Position = {
		x: undefined,
		y: undefined
	};

	let scrollDirection: ScrollDirection = {
		vertical: undefined,
		horizontal: undefined
	};
	let currentInView: boolean | undefined;
	let observer: IntersectionObserver | null = null;
	let frame = 0;

	function computeScrollDirection(entry: IntersectionObserverEntry) {
		if (prevPos.y !== undefined) {
			scrollDirection.vertical = prevPos.y > entry.boundingClientRect.y ? 'up' : 'down';
		}

		if (prevPos.x !== undefined) {
			scrollDirection.horizontal = prevPos.x > entry.boundingClientRect.x ? 'left' : 'right';
		}

		prevPos = {
			y: entry.boundingClientRect.y,
			x: entry.boundingClientRect.x
		};
	}

	function emit(entry: IntersectionObserverEntry, sourceObserver: IntersectionObserver | null) {
		const inView = entry.isIntersecting;

		computeScrollDirection(entry);

		if (currentInView === inView) {
			return;
		}

		currentInView = inView;

		const detail: ObserverEventDetails = {
			inView,
			entry,
			scrollDirection,
			node,
			observer: (sourceObserver ?? observer)! as IntersectionObserver
		};

		onChange?.(detail);

		if (inView) {
			onEnter?.(detail);

			if (unobserveOnEnter) {
				cleanup();
			}
		} else {
			onLeave?.(detail);
		}
	}

	function isInView() {
		const rect = node.getBoundingClientRect();
		const rootRect = root?.getBoundingClientRect() ?? {
			top: 0,
			right: window.innerWidth,
			bottom: window.innerHeight,
			left: 0
		};

		return (
			rect.bottom > rootRect.top - rootMarginValues.top &&
			rect.top < rootRect.bottom + rootMarginValues.bottom &&
			rect.right > rootRect.left - rootMarginValues.left &&
			rect.left < rootRect.right + rootMarginValues.right
		);
	}

	function evaluateVisibility() {
		frame = 0;
		emit(getFallbackEntry(node, isInView()), observer);
	}

	function scheduleEvaluate() {
		if (frame) {
			return;
		}

		frame = requestAnimationFrame(evaluateVisibility);
	}

	function cleanup() {
		observer?.unobserve(node);
		observer?.disconnect();
		observer = null;

		window.removeEventListener('scroll', scheduleEvaluate);
		window.removeEventListener('resize', scheduleEvaluate);

		if (frame) {
			cancelAnimationFrame(frame);
			frame = 0;
		}
	}

	if (typeof IntersectionObserver !== 'undefined' && node) {
		observer = new IntersectionObserver(
			(entries, _observer) => {
				entries.forEach((singleEntry) => {
					emit(singleEntry, _observer);
				});
			},
			{
				root,
				rootMargin,
				threshold
			}
		);

		// This dispatcher has to be wrapped in setTimeout, as it won't work otherwise.
		// Not sure why is it happening, maybe a callstack has to pass between the listeners?
		// Definitely something to investigate to understand better.
		setTimeout(() => {
			onInit?.({ observer: observer as IntersectionObserver, node });
			scheduleEvaluate();
		}, 0);

		observer.observe(node);
		window.addEventListener('scroll', scheduleEvaluate, { passive: true });
		window.addEventListener('resize', scheduleEvaluate, { passive: true });

		return {
			destroy() {
				cleanup();
			}
		};
	}
}

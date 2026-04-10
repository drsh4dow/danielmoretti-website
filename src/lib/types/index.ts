export type Options = {
	root?: HTMLElement | null;
	rootMargin?: string;
	threshold?: number | number[];
	unobserveOnEnter?: boolean;
	onChange?: (detail: ObserverEventDetails) => void;
	onEnter?: (detail: ObserverEventDetails) => void;
	onLeave?: (detail: ObserverEventDetails) => void;
	onInit?: (detail: LifecycleEventDetails) => void;
};

export type Position = {
	x?: number;
	y?: number;
};

// Types below needs to be manually copied to additional-svelte.jsx.d.ts file - more details there
type Direction = 'up' | 'down' | 'left' | 'right';

export type ScrollDirection = {
	vertical?: Direction;
	horizontal?: Direction;
};

export type ObserverEventDetails = {
	inView: boolean;
	entry: IntersectionObserverEntry;
	scrollDirection: ScrollDirection;
	node: HTMLElement;
	observer: IntersectionObserver;
};

export type LifecycleEventDetails = {
	node: HTMLElement;
	observer: IntersectionObserver;
};

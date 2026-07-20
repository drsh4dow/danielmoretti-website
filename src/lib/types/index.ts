export type ObserverEventDetails = {
	inView: boolean;
	node: HTMLElement;
};

export type Options = {
	root?: HTMLElement | null;
	rootMargin?: string;
	threshold?: number | number[];
	unobserveOnEnter?: boolean;
	onChange?: (detail: ObserverEventDetails) => void;
	onEnter?: (detail: ObserverEventDetails) => void;
	onLeave?: (detail: ObserverEventDetails) => void;
};

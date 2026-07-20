export function scrollToSection(sectionId: string) {
	const elem = document.querySelector(sectionId);
	if (!elem) return false;

	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	elem.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
	return true;
}

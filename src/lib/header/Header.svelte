<script lang="ts">
	import { scrollToSection } from '$lib/util/scrollToSection';
	import Logo from './Logo.svg';
</script>

<header class="fixed z-30 h-16 w-full border-b border-slate-50/5 bg-slate-900/75 backdrop-blur-lg">
	<div
		class="mx-auto flex h-full max-w-screen-xl items-center justify-between px-2 sm:px-4 md:px-6"
	>
		<a
			href="/"
			class="flex items-center justify-start gap-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
		>
			<img src={Logo} alt="" />
			<span class="text-xl font-black select-none">Daniel Moretti</span>
		</a>
		<nav class="flex items-center">
			<a
				class="hidden text-xl font-bold text-slate-200/90 hover:text-slate-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400 md:inline"
				href="/#work-section"
				onclick={(event) => {
					if (scrollToSection('#work-section')) event.preventDefault();
				}}
				data-sveltekit-preload-data>Portfolio</a
			>
			<a
				class="-my-2 -mr-2 ml-2 inline-flex items-center p-2 text-lg font-bold text-slate-200/90 hover:text-slate-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400 md:ml-6 md:text-xl"
				href="/blog"
				data-sveltekit-preload-data>Blog</a
			>
			<div class="mx-6 hidden h-8 border border-slate-200/5 sm:inline md:mx-8"></div>
			<a
				href="mailto:daniel.morettiv@gmail.com"
				aria-label="Send Daniel an email"
				class="group -my-1.5 -ml-3 inline-flex cursor-pointer items-center py-1.5 pl-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
			>
				<svg
					width="32"
					height="32"
					viewBox="0 0 32 32"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						class="fill-slate-200/75 group-[:hover]:fill-slate-200"
						d="M26.6667 24H24.0001V12.3333L16.0001 17.3333L8.00008 12.3333V24H5.33341V8.00001H6.93341L16.0001 13.6667L25.0667 8.00001H26.6667M26.6667 5.33334H5.33341C3.85341 5.33334 2.66675 6.52001 2.66675 8.00001V24C2.66675 24.7073 2.9477 25.3855 3.4478 25.8856C3.94789 26.3857 4.62617 26.6667 5.33341 26.6667H26.6667C27.374 26.6667 28.0523 26.3857 28.5524 25.8856C29.0525 25.3855 29.3334 24.7073 29.3334 24V8.00001C29.3334 6.52001 28.1334 5.33334 26.6667 5.33334Z"
					/>
				</svg>
			</a>
			<a
				href="https://www.linkedin.com/in/dmorettiv"
				target="_blank"
				aria-label="Visit Daniel's LinkedIn profile"
				class="group mx-0.5 -my-1.5 inline-flex cursor-pointer items-center p-1.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400 md:mx-2.5"
				rel="noreferrer"
			>
				<svg
					width="32"
					height="32"
					viewBox="0 0 32 32"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						class="fill-slate-200/75 group-[:hover]:fill-slate-200"
						d="M25.3333 4C26.0406 4 26.7189 4.28095 27.219 4.78105C27.719 5.28115 28 5.95942 28 6.66667V25.3333C28 26.0406 27.719 26.7189 27.219 27.219C26.7189 27.719 26.0406 28 25.3333 28H6.66667C5.95942 28 5.28115 27.719 4.78105 27.219C4.28095 26.7189 4 26.0406 4 25.3333V6.66667C4 5.95942 4.28095 5.28115 4.78105 4.78105C5.28115 4.28095 5.95942 4 6.66667 4H25.3333ZM24.6667 24.6667V17.6C24.6667 16.4472 24.2087 15.3416 23.3936 14.5264C22.5784 13.7113 21.4728 13.2533 20.32 13.2533C19.1867 13.2533 17.8667 13.9467 17.2267 14.9867V13.5067H13.5067V24.6667H17.2267V18.0933C17.2267 17.0667 18.0533 16.2267 19.08 16.2267C19.5751 16.2267 20.0499 16.4233 20.3999 16.7734C20.75 17.1235 20.9467 17.5983 20.9467 18.0933V24.6667H24.6667ZM9.17333 11.4133C9.76742 11.4133 10.3372 11.1773 10.7573 10.7573C11.1773 10.3372 11.4133 9.76742 11.4133 9.17333C11.4133 7.93333 10.4133 6.92 9.17333 6.92C8.57571 6.92 8.00257 7.1574 7.57999 7.57999C7.1574 8.00257 6.92 8.57571 6.92 9.17333C6.92 10.4133 7.93333 11.4133 9.17333 11.4133ZM11.0267 24.6667V13.5067H7.33333V24.6667H11.0267Z"
					/>
				</svg>
			</a>
			<a
				class="group -my-1.5 -mr-3 inline-flex cursor-pointer items-center py-1.5 pr-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
				href="https://github.com/drsh4dow"
				target="_blank"
				aria-label="Visit Daniel's GitHub profile"
				rel="noreferrer"
			>
				<svg
					width="32"
					height="32"
					viewBox="0 0 32 32"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						class="fill-slate-200/75 group-[:hover]:fill-slate-200"
						d="M16.0001 2.66666C14.2491 2.66666 12.5153 3.01153 10.8976 3.6816C9.27996 4.35166 7.81011 5.33379 6.57199 6.5719C4.07151 9.07238 2.66675 12.4638 2.66675 16C2.66675 21.8933 6.49341 26.8933 11.7867 28.6667C12.4534 28.7733 12.6667 28.36 12.6667 28C12.6667 27.6933 12.6667 26.8533 12.6667 25.7467C8.97341 26.5467 8.18675 23.96 8.18675 23.96C7.57341 22.4133 6.70675 22 6.70675 22C5.49341 21.1733 6.80008 21.2 6.80008 21.2C8.13341 21.2933 8.84008 22.5733 8.84008 22.5733C10.0001 24.6 11.9601 24 12.7201 23.68C12.8401 22.8133 13.1867 22.2267 13.5601 21.8933C10.6001 21.56 7.49341 20.4133 7.49341 15.3333C7.49341 13.8533 8.00008 12.6667 8.86675 11.72C8.73341 11.3867 8.26675 9.99999 9.00008 8.19999C9.00008 8.19999 10.1201 7.83999 12.6667 9.55999C13.7201 9.26666 14.8667 9.11999 16.0001 9.11999C17.1334 9.11999 18.2801 9.26666 19.3334 9.55999C21.8801 7.83999 23.0001 8.19999 23.0001 8.19999C23.7334 9.99999 23.2667 11.3867 23.1334 11.72C24.0001 12.6667 24.5067 13.8533 24.5067 15.3333C24.5067 20.4267 21.3867 21.5467 18.4134 21.88C18.8934 22.2933 19.3334 23.1067 19.3334 24.3467C19.3334 26.1333 19.3334 27.5733 19.3334 28C19.3334 28.36 19.5467 28.7867 20.2267 28.6667C25.5201 26.88 29.3334 21.8933 29.3334 16C29.3334 14.249 28.9885 12.5152 28.3185 10.8975C27.6484 9.27987 26.6663 7.81001 25.4282 6.5719C24.1901 5.33379 22.7202 4.35166 21.1025 3.6816C19.4849 3.01153 17.751 2.66666 16.0001 2.66666Z"
					/>
				</svg>
			</a>
		</nav>
	</div>
</header>

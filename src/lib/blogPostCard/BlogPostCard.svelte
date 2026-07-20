<script lang="ts">
	interface Props {
		title: string;
		description: string;
		date: string;
		displayDate: string;
		uid: string;
	}

	let { title, description, date, displayDate, uid }: Props = $props();
</script>

<article class="md:grid md:grid-cols-4 md:items-baseline">
	<div class="group relative flex flex-col items-start md:col-span-3">
		<div
			class="absolute inset-x-0 -inset-y-6 z-0 scale-95 bg-slate-800 opacity-0 transition duration-200 group-focus-within:scale-100 group-focus-within:opacity-100 group-[:hover]:scale-100 group-[:hover]:opacity-100 sm:-inset-x-6 sm:rounded-2xl"
		></div>
		<h2 class="text-base font-semibold tracking-tight text-sky-400">
			<a href={`/blog/${uid}`} data-sveltekit-preload-data>
				<span class="absolute inset-x-0 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl"></span>
				<span class="relative z-10">{title}</span>
			</a>
		</h2>
		<time
			datetime={date}
			class="relative z-10 order-first mb-3 flex items-center pl-3.5 text-sm text-slate-200 md:hidden"
		>
			<span class="absolute inset-y-0 left-0 flex items-center" aria-hidden="true">
				<span class="h-4 w-0.5 rounded-full bg-sky-500"></span>
			</span>
			{displayDate}
		</time>
		<p class="relative z-10 mt-2 text-sm text-slate-200">{description}</p>
		<div
			aria-hidden="true"
			class="relative z-10 mt-4 flex items-center text-sm font-medium text-sky-500"
		>
			Read Post<svg
				viewBox="0 0 16 16"
				fill="none"
				aria-hidden="true"
				class="ml-1 h-4 w-4 stroke-current"
				><path
					d="M6.75 5.75 9.25 8l-2.5 2.25"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/></svg
			>
		</div>
	</div>
	<time
		datetime={date}
		class="relative z-10 order-first mt-1 mb-3 hidden text-sm text-slate-400 md:block"
	>
		{displayDate}
	</time>
</article>

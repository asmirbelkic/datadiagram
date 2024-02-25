<script lang="ts">
	import Input from "./Input.svelte";
	import { fade } from "svelte/transition";
	import { clickOutside } from "$lib/util";
	export let layout: "auto" | "flex" | "fill" | "fit" | number = 175;
	export let editable: boolean = false;
	export let type: any;
	export let value: any;

	const fromLayout = () => {
		if (layout === "auto") return "width: auto;";
		if (layout == "flex") return "flex-grow: 1;";
		if (layout == "fill") return "width: 100%;";
		if (layout == "fit") return "width: fit-content;";
		else return `width: ${layout}px;`;
	};

	export let options: string[];
	export let selected = options[0];
	let showing: boolean = false;

	function handleShow () {
		showing = !showing;
	}
</script>

<main class="container" class:editable>
	<button class={type} style={fromLayout()}>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<span on:click|stopPropagation={handleShow}>
			{selected}
			{#if editable}
				<svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M4.18179 6.68182C4.35753 6.50609 4.64245 6.50609 4.81819 6.68182L7.49999 9.36363L10.1818 6.68182C10.3575 6.50609 10.6424 6.50609 10.8182 6.68182C10.9939 6.85756 10.9939 7.14248 10.8182 7.31822L7.81819 10.3182C7.73379 10.4026 7.61934 10.45 7.49999 10.45C7.38064 10.45 7.26618 10.4026 7.18179 10.3182L4.18179 7.31822C4.00605 7.14248 4.00605 6.85756 4.18179 6.68182Z"
						fill="#A0A0A0"
					/>
				</svg>
			{/if}
		</span>
		{#if type === "varchar"}
			<Input placeholder="255" {value} layout="auto" readonly={!editable} type="number" />
		{/if}
	</button>
	{#if showing}
		<main class="dropdown" transition:fade={{ duration: 80 }} use:clickOutside={() => (showing = false)}>
			{#each options as option}
				<div
					class:selected={selected === option}
					on:click={() => {
						selected = option;
						showing = false;
					}}
				>
					{option}
				</div>
			{/each}
		</main>
	{/if}
</main>

<style lang="scss">
	* {
		box-sizing: border-box;
	}

	button {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1px;
		width: 100%;

		height: 20px;

		border: 1px solid transparent;
		border-radius: 4px;

		background: transparent;
		outline: none;

		color: #ededed;

		font-family: "SF Mono";
		font-style: normal;
		font-weight: 300;
		font-size: 14px;
		line-height: 17px;

		user-select: none;
		position: relative;
		&:hover {
			background: #414141;
		}
		svg {
			flex-shrink: 0;
		}
		span {
			display: flex;
			cursor: pointer;
			align-items: center;
		}
		&.int {
			color: #efc900;
		}
		&.varchar {
			color: #f17400;
		}
		&.null {
			color: #9e9e9e;
		}
		&.timestamp {
			color: #00d0ab;
		}
		button {
			background: #414141;
			aspect-ratio: 1;
			display: flex;
			color: #adadad;
			align-items: center;
			justify-content: center;
			svg {
				width: 12px;
				height: 12px;
			}
		}
	}

	main.dropdown {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);

		display: flex;
		flex-direction: column;
		align-items: flex-start;

		background: #252629;

		width: fit-content;
		height: fit-content;
		z-index: 100;
		padding: 4px;
		border-radius: 8px;
		border: 2px solid #464b55;
		background: #252629;
		box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px;
		> div {
			display: flex;
			flex-direction: row;
			align-items: center;
			padding: 10px 16px;
			border-radius: 6px;
			gap: 10px;

			width: 100%;
			height: 32px;

			font-family: "SF Mono";
			font-style: normal;
			font-weight: 300;

			letter-spacing: 0.01em;

			color: #ededed;
			user-select: none;
			cursor: pointer;
			&.selected {
				background: #363a3f;
			}
			&:hover {
				color: #fff;
				background-color: #1371ff;
			}
		}
	}

	main.container {
		position: relative;
		width: fit-content;
		pointer-events: none;
		width: 100%;
		&.editable {
			pointer-events: auto;
		}
	}
</style>

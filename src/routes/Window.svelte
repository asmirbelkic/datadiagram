<script lang="ts">
	import { positions } from "$lib/state";
	import type { Table } from "$lib/state";
	export let table: Table;
	export let readOnly: boolean = false;
	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();
	let moving: boolean = false;
	let mainElement: HTMLElement;

	let x: number = 0,
		y: number = 0;

	$: grabbinStyle = moving ? `transform: scale(1.03) rotate(${parseFloat((Math.random() * (3 - -3) + -3).toString()).toFixed(2)}deg)` : "";
	const onMouseDown = (event: MouseEvent) => {
		event.preventDefault(); // Empêche le comportement par défaut du navigateur
		moving = true;

		// Obtenez la position de l'élément par rapport au viewport
		const rect = mainElement.getBoundingClientRect();
		console.log(rect.x, rect.y);
		console.log(event.clientX, event.clientY);


		// Enregistrez la position initiale du curseur par rapport à l'élément.
		x = event.clientX;
		y = event.clientY;
	};

	const onMouseMove = (event: MouseEvent) => {

		if (moving) {
			const dx = event.clientX - x;
			const dy = event.clientY - y;

			mainElement.style.top = (mainElement.offsetTop + dy) + "px";
			mainElement.style.left = (mainElement.offsetLeft + dx) + "px";

			x = event.clientX;
			y = event.clientY;

			positions.update((currentPositions) => {
				const updatedPositions = { ...currentPositions };
				updatedPositions[table.name] = { left: x, top: y };
				return updatedPositions;
			});

			table.position = [mainElement.offsetLeft, mainElement.offsetTop];
		}
	};

	function toggleReadOnly() {
		readOnly = !readOnly;
		dispatch("update", { readOnly });
	}
</script>

<main bind:this={mainElement} class:grabbing={moving} class="outer" style="left: {table.position[0]}px; top: {table.position[1]}px; {grabbinStyle}">
	<header>
		<h5 on:click|stopPropagation={toggleReadOnly}>{table.name}</h5>
		<span class="move" on:mousedown|stopPropagation={onMouseDown}>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-move">
				<polyline points="5 9 2 12 5 15"></polyline>
				<polyline points="9 5 12 2 15 5"></polyline>
				<polyline points="15 19 12 22 9 19"></polyline>
				<polyline points="19 9 22 12 19 15"></polyline>
				<line x1="2" y1="12" x2="22" y2="12"></line>
				<line x1="12" y1="2" x2="12" y2="22"></line>
			</svg>
		</span>
	</header>
	<slot />
</main>

<svelte:window on:mousemove={onMouseMove} on:mouseup={() => (moving = false)} />

<style lang="scss">
	.outer {
		user-select: none;
		-webkit-user-drag: none;
		position: absolute;
		display: flex;
		flex-direction: column;
		transition: transform .12s ease;
		header {
			gap: 6px;
			display: flex;
			h5 {
				padding: 2px 5px;
				border-radius: 6px;
				margin: 0;
				margin-bottom: 6px;
				font-size: 12px;
				font-weight: 300;
				cursor: pointer;
				color: #9e9e9e;
				&:hover {
					color: #3d91ff;
				}
			}
			.move {
				cursor: grab;
				aspect-ratio: 1;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 6px;
				background: #3e4147;
				width: 18px;
				color: #9e9e9e;
				height: 18px;
				svg {
					width: 10px;
					height: 10px;
				}
				&:hover {
					color: #fff;
				}
			}
		}
	}
</style>

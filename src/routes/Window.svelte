<script lang="ts">
	import { positions } from "$lib/state";
	import type { Table } from "$lib/state";
	export let table: Table;
	export let elements: { [key: string]: HTMLElement } = {};
	export let position: [number, number];
	let x: number = position[0] * 25 || 0, y: number = position[1] * 25 || 0;

	let moving: boolean = false;
	let mainElement: HTMLElement;

	let offsetX: number = 0, offsetY: number = 0;

	const gridSize = 25; // Taille de la grille

	function adjustToGrid(value:any) {
		return Math.round(value / gridSize) * gridSize;
	}

	const onMouseDown = (event: MouseEvent) => {
		offsetX = event.clientX - mainElement.getBoundingClientRect().left;
		offsetY = event.clientY - mainElement.getBoundingClientRect().top;
		moving = true;
	};

	const onTouchStart = (event: TouchEvent) => {
		offsetX = event.touches[0].pageX - mainElement.getBoundingClientRect().left;
		offsetY = event.touches[0].pageY - mainElement.getBoundingClientRect().top;
		moving = true;
	};

	const onMouseMove = (event: MouseEvent) => {
		if (moving) {
			let newX = adjustToGrid(event.clientX - offsetX);
			let newY = adjustToGrid(event.clientY - offsetY);

			mainElement.style.left = `${newX}px`;
			mainElement.style.top = `${newY}px`;
		}
	};

	const onTouchMove = (event: TouchEvent) => {
		if (moving) {
			let newX = adjustToGrid(event.touches[0].pageX - offsetX);
			let newY = adjustToGrid(event.touches[0].pageY - offsetY);

			mainElement.style.left = `${newX}px`;
			mainElement.style.top = `${newY}px`;
		}
	};

	$: if (elements[table.name]) {
		const left = adjustToGrid(mainElement.offsetLeft);
		const top = adjustToGrid(mainElement.offsetTop);

		positions.update(currentPositions => {
			const updatedPositions = { ...currentPositions };
			updatedPositions[table.name] = { left: left / gridSize, top: top / gridSize };
			return updatedPositions;
		});
	}
</script>

<main bind:this={mainElement} class:grabbing={moving} on:mousedown={onMouseDown} on:touchstart={onTouchStart} class="outer" style="left: {x}px; top: {y}px;">
	<slot></slot>
</main>

<svelte:window on:mousemove={onMouseMove} on:mouseup={() => moving = false} on:touchmove={onTouchMove}></svelte:window>

<style lang="scss">
	.outer {
		position: absolute;
		cursor: grab;
		transform: rotate(0);
		transition:
			transform 0.2s ease-in-out,
			border-color 0.2s ease-in-out,
			box-shadow 0.2s ease-in-out;
		&.grabbing {
			transform: rotate(-2deg);
			cursor: grabbing !important;
		}
	}
</style>

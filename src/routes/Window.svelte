<script lang="ts">
	import { positions } from "$lib/state";
	import type { Table } from "$lib/state";
	export let table: Table;
	export let elements: { [key: string]: HTMLElement } = {};
	export let position: [number, number];
	let x: number = position[0] || 0, y: number = position[1] || 0;

	let moving: boolean = false;
	let mainElement: HTMLElement;

	let offsetX: number = 0, offsetY: number = 0;

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
			mainElement.style.left = (event.clientX - offsetX) + "px";
			mainElement.style.top = (event.clientY - offsetY) + "px";
		}
	};

	const onTouchMove = (event: TouchEvent) => {
		if (moving) {
			mainElement.style.left = (event.touches[0].pageX - offsetX) + "px";
			mainElement.style.top = (event.touches[0].pageY - offsetY) + "px";
		}
	};

	$: if (elements[table.name]) {
		positions.update(currentPositions => {
			const updatedPositions = { ...currentPositions };
			updatedPositions[table.name] = {
				left: mainElement.offsetLeft,
				top: mainElement.offsetTop
			};
			return updatedPositions;
		});
	}
</script>

<main bind:this={mainElement} on:mousedown={onMouseDown} on:touchstart={onTouchStart} class="outer" style="left: {x}px; top: {y}px;">
	<slot></slot>
</main>

<svelte:window on:mousemove={onMouseMove} on:mouseup={() => moving = false} on:touchmove={onTouchMove}></svelte:window>

<style lang="scss">
	.outer {
			position: absolute;
			cursor: grab;
	}
</style>

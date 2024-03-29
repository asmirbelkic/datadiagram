<script lang="ts">
	import { positions, isSelecting, hoveredElement, selectedElement, tempLine } from "$lib/state";
	import { clickOutside } from "$lib/util";
	export let handleElementClick: (event: Event, name: string) => void; // Fonction pour gérer le clic sur l'élément
	export let name: string;
	export let position: [number, number] = [0, 0];
	export let cancelRelationCreation: (readOnly: boolean) => void;

	export let readOnly: boolean | null = false;
	import Input from "./Input.svelte";
	let moving: boolean = false;
	let mainElement: HTMLElement;
	export const lines: LeaderLine[] = [];
	let editName: boolean = false;
	let x: number = 0,
		y: number = 0;

	$: grabbinStyle = moving ? `transform: rotate(${parseFloat((Math.random() * (3 - -3) + -3).toString()).toFixed(2)}deg)` : "";
	const onMouseDown = (event: MouseEvent) => {
		moving = true;

		// Enregistrez la position initiale du curseur par rapport à l'élément.
		x = event.clientX;
		y = event.clientY;
	};

	const onMouseMove = (event: MouseEvent) => {
		if (moving) {
			let dx = event.clientX - x;
			let dy = event.clientY - y;
			// mainElement.style.top = mainElement.offsetTop + dy + "px";
			// mainElement.style.left = mainElement.offsetLeft + dx + "px";

			x = event.clientX;
			y = event.clientY;

			positions.update((currentPositions) => {
				const updatedPositions = { ...currentPositions };
				updatedPositions[name] = { left: x, top: y };

				return updatedPositions;
			});

			position = [mainElement.offsetLeft + dx, mainElement.offsetTop + dy];
		}
	};

	function onMouseUp() {
		moving = false;

		lines.forEach(line => line.position());
	}

	function toggleReadOnly() {
		if (!editName) readOnly = !readOnly;
	}

	function handleMouseEnter() {
		hoveredElement.set({ table: name, column: null }); // Exemple pour Window
	}

	function handleMouseLeave() {
		hoveredElement.set({ table: null, column: null });
	}

	function handleOutsideClick() {
		if (!$isSelecting) {
			readOnly = false;
			editName = false;
		}
		cancelRelationCreation(readOnly || false);
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- <main  bind:this={mainElement} on:click|stopPropagation={(event) => handleElementClick(event, name)} on:mouseenter={handleMouseEnter} on:mouseleave={handleMouseLeave} class:selected={name === selectedFullName} class:unhovered={$isSelecting && name === selectedFullName} class:hovered={$isSelecting && $hoveredElement.table === name && selectedFullName !== name} class:grabbing={moving} class="outer" style="left: {position[0]}px; top: {position[1]}px; {grabbinStyle}" use:clickOutside={handleOutsideClick}> -->
<main bind:this={mainElement} on:click|stopPropagation={(event) => handleElementClick(event, name)} on:mouseup={onMouseUp} on:mouseenter={handleMouseEnter} on:mouseleave={handleMouseLeave} class:grabbing={moving} class="outer" style="left: {position[0]}px; top: {position[1]}px; {grabbinStyle}" use:clickOutside={handleOutsideClick}>
	<!-- <main bind:this={mainElement} class:grabbing={moving} class="outer" style="left: {position[0]}px; top: {position[1]}px; {grabbinStyle}" use:clickOutside={handleOutsideClick}> -->
	<header>
		<h5 on:dblclick={() => (editName = true)}>
			{#if readOnly}
				<i class="edit"></i>
			{/if}
			{#if editName}
				<Input type="text" style="height: 18px;" layout="auto" autofocus={true} bind:value={name} />
			{:else}
				<span>{name}</span>
			{/if}
		</h5>
		{#if editName}
			<button
				class="btn"
				on:click={() => {
					editName = false;
				}}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
			</button>
		{/if}
		<button class="btn grab" on:mousedown|stopPropagation={onMouseDown} disabled={$isSelecting}>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-move">
				<polyline points="5 9 2 12 5 15"></polyline>
				<polyline points="9 5 12 2 15 5"></polyline>
				<polyline points="15 19 12 22 9 19"></polyline>
				<polyline points="19 9 22 12 19 15"></polyline>
				<line x1="2" y1="12" x2="22" y2="12"></line>
				<line x1="12" y1="2" x2="12" y2="22"></line>
			</svg>
		</button>
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<button class="btn" on:click|stopPropagation={toggleReadOnly}>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-3">
				<path d="M12 20h9"></path>
				<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
			</svg>
		</button>
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
		transition: transform 0.12s ease;
		border-radius: 6px;
		outline-offset: 6px;
		outline: 2px solid transparent;
		&.selected {
			outline-color: #00b894;
		}
		&:hover.unhovered {
			outline-color: #d63031 !important;
		}
		&.hovered {
			outline-color: #3d91ff;
		}

		header {
			gap: 8px;
			align-items: center;
			display: flex;
			margin-bottom: 6px;
			h5 {
				border-radius: 6px;
				display: flex;
				align-items: center;
				gap: 6px;
				margin: 0;
				margin-left: 5px;
				font-size: 12px;
				font-weight: 300;
				cursor: pointer;
				color: #9e9e9e;
				&:hover {
					span {
						color: #3d91ff;
					}
				}
				i {
					width: 5px;
					height: 5px;
					display: block;
					border-radius: 50%;
					background: #3d91ff;
				}
			}
			.btn {
				cursor: pointer;
				aspect-ratio: 1;
				display: flex;
				align-items: center;
				justify-content: center;
				border: 0;
				padding: 0;
				border-radius: 6px;
				background: #3e4147;
				width: 18px;
				color: #9e9e9e;
				height: 18px;
				svg {
					width: 10px;
					height: 10px;
				}
				&.grab {
					cursor: grab;
				}
				&:hover {
					color: #fff;
				}
			}
		}
	}
</style>

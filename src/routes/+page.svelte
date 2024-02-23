<script lang="ts">
	import { positions } from "$lib/state";
	import { onMount, afterUpdate } from "svelte";
	import { existingDatabases, relations } from "$lib/state";
	import Block from "./Block.svelte";
	import LeaderLine from "leader-line-new";

	let lines: LeaderLine[] = [];
  let elements: { [key: string]: HTMLElement } = {};

  positions.subscribe($positions => {
    if (lines.length > 0) {
      updateLines();
    }
  });

	const createLines = (): void => {
		lines.forEach((line) => line.remove());
		lines = [];

		relations.forEach((relation) => {
			const startElement = elements[relation.from];
			const endElement = elements[relation.to];
			if (startElement && endElement) {
				const line = new LeaderLine(startElement, endElement, {
					color: "#666666",
					size: 2,
					path: "magnet",
					endPlugSize: 1.5,
					startPlug: "disc",
					endPlug: "arrow3",
					dash: { length: 4, gap: 4 },
				});
				lines.push(line);
			}
		});
	};

	function updateLines() {
    lines.forEach(line => line.position());
  }

	onMount(createLines);
	afterUpdate(createLines);
</script>

<main class="wrapper">
	{#each existingDatabases as table (table.name)}
		<Block {table} bind:elements />
	{/each}
</main>

<style lang="scss">
	.wrapper {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		gap: 124px;
		width: 100vw;
		height: 100vh;
		position: absolute;
		overflow: hidden;
	}
</style>

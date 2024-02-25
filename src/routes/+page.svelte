<script lang="ts">
	import type { Table } from "$lib/state";
	import { positions } from "$lib/state";
	import { onMount, afterUpdate } from "svelte";
	import { cards, relations } from "$lib/state";
	import Block from "./Block.svelte";
	import Window from "./Window.svelte";
	import LeaderLine from "leader-line-new";
	import Editor from "./Editor.svelte";
	let lines: LeaderLine[] = [];
	let elements: { [key: string]: HTMLElement } = {};

	let data: Array<Table> = [];

	cards.subscribe((value) => {
		data = value;
	});

	positions.subscribe(() => {
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
		lines.forEach((line) => line.position());
	}

	onMount(createLines);
	afterUpdate(createLines);

	function createTable(event: CustomEvent<{ index: number }>) {
		let index = event.detail.index;
		let newField = {
			name: "new" + Math.random(), // Assurez-vous que le nom est unique
			type: "text" as "text" | "int" | "varchar" | "timestamp",
		};
		data[index].fields.push(newField);
		data = [...data];
	}

	function deleteTable(event: CustomEvent<{ index: number }>) {
		let index = event.detail.index;
		data.splice(index, 1);
		data = [...data];
	}

	function updateTable(i: number, newReadOnly: any) {
		data[i] = { ...data[i], readOnly: newReadOnly };
		data = [...data];
	}
</script>

<main class="wrapper">
	<Editor>
		{#each data as table, i}
			<Window {table} readOnly={table.readOnly || false} on:update={({ detail }) => updateTable(i, detail.readOnly)}>
				<Block {table} {elements} readOnly={table.readOnly || false} index={i} on:create={createTable} on:delete={deleteTable} />
			</Window>
		{/each}
	</Editor>
	<!-- <p>{JSON.stringify(data, null, 2)}</p> -->
</main>

<style lang="scss">
	p {
		color: white;
	}
	.wrapper {
		display: grid;
		place-content: center;
		width: 100%;
		height: 100%;
		background-image: radial-gradient(#363841 1px, transparent 0);
		background-size: 15px 15px;
		background-position: 11px 11px;
	}
</style>

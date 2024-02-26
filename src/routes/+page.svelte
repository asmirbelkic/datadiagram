<script lang="ts">
	import type { Table } from "$lib/state";
	import { positions, hoveredElement, selectedElement, isSelecting } from "$lib/state";
	import { onMount, afterUpdate } from "svelte";
	import { cards, relations } from "$lib/state";
	import Block from "./Block.svelte";
	import Window from "./Window.svelte";
	import LeaderLine from "leader-line-new";
	import Editor from "./Editor.svelte";
	let lines: LeaderLine[] = [];
	let elements: { [key: string]: HTMLElement } = {};
	import { get } from "svelte/store";

	let tempPoint; // Référence à l'élément temporaire
  let mouseLine = null;
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

		$relations.forEach((relation) => {
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
			id: Math.random(),
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

	function onLinkRemove(event: CustomEvent<{ name: string, id: number, }>) {
		const { name, id } = event.detail;
		console.log(id, name);

		relations.update((currentRelations) => {
			const updatedRelations = currentRelations.filter((relation) => relation.from !== name && relation.to !== name);
			return updatedRelations;
		});
		cards.update(currentCards => {
        return currentCards.map(card => {
            if (card.name === name) {
                return {
                    ...card,
                    fields: card.fields.map(field => {
                        if (field.id === id) {
                            return { ...field, linked: false };
                        }
                        return field;
                    })
                };
            }
            return card;
        });
    });
		console.log(data[0].fields[id].linked);

	}

	// Exemple d'utilisation dans une fonction de clic
	export function handleElementClick(elementId: string) {
		if($selectedElement === elementId) {
			selectedElement.set(null);
			isSelecting.set(false);
		}
    const currentlySelecting = get(isSelecting);
    if (!currentlySelecting) return;

    const currentSelected = get(selectedElement);
    if (currentSelected) {
        relations.update(current => [...current, { from: currentSelected, to: elementId }]);
        selectedElement.set(null); // Réinitialisez après la création
        isSelecting.set(false); // Désactivez le mode de sélection
    } else {
        selectedElement.set(elementId);
    }
}

	function handleElementHover(elementId: string) {
		if (!isSelecting) return;
		hoveredElement.set(elementId);
	}

	function handleElementHoverLeave() {
		hoveredElement.set(null);
	}
</script>

<main class="wrapper">
	<Editor>
		{#each data as table, i}
			<Window bind:name={table.name} bind:position={table.position} bind:readOnly={table.readOnly} handleElementClick={() => handleElementClick(table.name)}>
				<Block {table} {elements} readOnly={table.readOnly || false} index={i} on:create={createTable} on:delete={deleteTable} on:removeLink={onLinkRemove} />
			</Window>
		{/each}
	</Editor>
	<!-- <p>{JSON.stringify($isSelecting, null, 2)}
		{JSON.stringify($selectedElement, null, 2)}
		{JSON.stringify($hoveredElement, null, 2)}
		</p> -->
</main>

<svelte:window on:mousemove={updateLines} on:mouseup={updateLines} />

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

<script lang="ts">
	import type { Table } from "$lib/state";
	import { get } from "svelte/store";
	import { positions, hoveredElement, selectedElement, isSelecting } from "$lib/state";
	import { onMount, onDestroy } from "svelte";
	import { cards, relations } from "$lib/state";
	import Block from "./Block.svelte";
	import Window from "./Window.svelte";
	import Editor from "./Editor.svelte";

	let LeaderLine: any = null;
	let lines: Map<number, LeaderLine> = new Map<number, LeaderLine>();
	let elements: { [key: string]: HTMLElement } = {};
	let cursorPos = { x: 0, y: 0 };

	let tempLine: LeaderLine | null = null;
	let mousePoint: HTMLElement;
	let data: Array<Table> = [];

	// function pour cancel la création de relation
	function cancelCreatingRelation() {
		if ($isSelecting && tempLine) {
			tempLine.remove();
			tempLine = null;
			isSelecting.set(false);
			selectedElement.set({ name: "", element: null, id: null });
		}
	}

	const createLines = (): void => {
		relations.update(($relations) => {
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
					relation.id = parseInt(line._id);
					lines.set(relation.id, line);
				}
			});
			return $relations;
		});
	};

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

	function onLinkRemove(event: CustomEvent<{ table: string; column: string; id: number }>) {
		const { table, column, id } = event.detail;
		const name = `${table}-${column}`;
		let relation = $relations.find((relation) => relation.from === name || relation.to === name);

		if (relation && relation.id !== null) {

			const line = lines.get(relation.id);
			if(!line) return;

			line.remove();
			lines.delete(relation.id);
			relations.update((currentRelations) => {
				const updatedRelations = currentRelations.filter((relation) => relation.from !== name && relation.to !== name);
				return updatedRelations;
			});

			// Pass cards fields with (name) fields with id to linked: false
			data.forEach((table) => {
				table.fields.forEach((field) => {
					if (field.id === id) {
						field.linked = false;
					}
				});
			});
		} else {
			console.error("L'objet line n'est pas défini ou la méthode remove est manquante.");
		}
	}

	function startCreatingRelation(fromElement: HTMLElement) {
		if (!fromElement) return;
		tempLine = new LeaderLine(fromElement, mousePoint, {
			startPlug: "disc",
			path: "magnet",
			endPlug: "arrow3",
			size: 2,
			dash: { animation: true },
		});
	}

	const createOneLine = (to: HTMLElement) => {
		if (!$selectedElement.element) return;
		const line = new LeaderLine($selectedElement.element, to, {
			color: "#666666",
			size: 2,
			path: "magnet",
			endPlugSize: 1.5,
			startPlug: "disc",
			endPlug: "arrow3",
			dash: { length: 4, gap: 4 },
		});
		lines.set(parseInt(line._id), line);
		return parseInt(line._id);
	};

	// Exemple d'utilisation dans une fonction de clic
	export function handleElementClick(event: Event, fromName: string, node?: HTMLElement, fromId?: number) {
		event.stopPropagation();
		if (!tempLine) return;
		if (!node) return;
		console.log($selectedElement.table === fromName);
		console.log($selectedElement.id === fromId);

		// if(currentSelected.table === fromName && currentSelected.id === fromId) {
		// 	selectedElement.set({
		// 		name: "",
		// 		element: null,
		// 		id: null,
		// 	});
		// 	isSelecting.set(false);
		// 	return;
		// }

		const currentlySelecting = get(isSelecting);
		if (!currentlySelecting) return;

		const currentSelected = get(selectedElement);
		if ($hoveredElement.table === currentSelected?.table && tempLine) {
			// Suppression de toutes les lignes temporaires
			tempLine.remove();

			selectedElement.set({
				name: "",
				element: null,
				id: null,
			});
			isSelecting.set(false);
			return;
		}

		if (currentSelected) {
			console.log(tempLine);

			const fromTableName = currentSelected.table;
			const fromFieldId = currentSelected.id;
			const toTableName = fromName;
			const toFieldId = fromId;

			if (!fromTableName || !fromFieldId || !toTableName || !toFieldId) return;
			setFieldAsLinked(fromTableName, fromFieldId);
			setFieldAsLinked(toTableName, toFieldId);
			// Update data with name of the table and the field id (linked) with true

			console.log(fromTableName, fromFieldId);
			console.log(toTableName, toFieldId);

			const id: number = createOneLine(node) as number;
			relations.update((currentRelations) => {
				const updatedRelations = [
					...currentRelations,
					{
						id: id,
						from: currentSelected.name || "",
						to: fromName,
					},
				];
				return updatedRelations;
			});
			selectedElement.set({ id: null, name: null });
			isSelecting.set(false);
		} else {
			selectedElement.set({
				name: fromName,
				element: node,
				id: null,
				table: fromName,
			});
		}
		tempLine?.remove();
	}

	// Fonction pour mettre à jour le champ avec `linked: true`
	function setFieldAsLinked(tableName: string, fieldId: number) {
		cards.update((tables) => {
			const tableIndex = tables.findIndex((table) => table.name === tableName);
			if (tableIndex === -1) return tables; // Table non trouvée, rien à faire

			const fieldIndex = tables[tableIndex].fields.findIndex((field) => field.id === fieldId);
			if (fieldIndex === -1) return tables; // Champ non trouvé, rien à faire

			tables[tableIndex].fields[fieldIndex].linked = true; // Met à jour le champ comme lié
			return tables;
		});
	}

	// Mettre à jour la position de mousePoint et tempLine à chaque mouvement de la souris
	function handleMouseMove(e: MouseEvent) {
		cursorPos = { x: e.clientX, y: e.clientY };
		if (mousePoint) {
			mousePoint.style.left = `${cursorPos.x}px`;
			mousePoint.style.top = `${cursorPos.y}px`;
		}

		if ($isSelecting && tempLine) {
			tempLine.position();
		}
	}

	function cancelRelationCreation(readOnly: boolean) {
		const hovered = get(hoveredElement).table;
		const selected = get(selectedElement).table;

		// Vérifier s'il y a une tempLine et si l'on est en mode sélection
		if (tempLine && $isSelecting) {
			// Si ni hovered ni selected ne sont présents, annuler la création de relation
			if (!selected || !hovered) {
				selectedElement.set({ id: null, name: null });
				isSelecting.set(false);
				tempLine.remove();
				readOnly = false;
				tempLine = null;
			}
		}
	}

	onMount(async () => {
		const module = await import("leader-line-new");
		LeaderLine = module.default;
		createLines();
	});

	onDestroy(() => {
		tempLine?.remove();
		lines.forEach((line) => line.remove());
	});

	cards.subscribe((value) => {
		data = value;
	});

	positions.subscribe(() => {
		lines.forEach((line) => line.position());
	});
</script>

<main class="wrapper">
	<Editor>
		{#each data as table, i}
			<Window bind:name={table.name} bind:position={table.position} bind:readOnly={table.readOnly} {handleElementClick} {cancelRelationCreation}>
				<Block {table} {elements} readOnly={table.readOnly || false} index={i} on:create={createTable} on:delete={deleteTable} on:removeLink={onLinkRemove} {handleElementClick} {startCreatingRelation} />
			</Window>
		{/each}
	</Editor>
	<!-- <span class="debug">
		<p>
			{JSON.stringify($selectedElement.table)}
			<br />
			{JSON.stringify($selectedElement.column)}
		</p>
		<p>{JSON.stringify($hoveredElement)}</p>
	</span>
	<div id="debug">
		<pre>{JSON.stringify($relations, null, 2)}</pre>
	</div> -->
</main>
<svelte:window
	on:mousemove={handleMouseMove}
	on:keydown={(e) => {
		if (e.key === "Escape") cancelCreatingRelation();
	}}
/>

<div bind:this={mousePoint} id="mouse-point" style="left: {cursorPos.x}px; top: {cursorPos.y}px; visibility: {$isSelecting ? 'visible' : 'hidden'}"></div>

<style lang="scss">
	#mouse-point {
		position: absolute;
		width: 5px;
		height: 5px;
		background: #ff7f50;
		pointer-events: none;
		border-radius: 50%;
	}
	.debug {
		position: fixed;
		top: 0;
		left: 0;
		width: 500px;
	}
	p {
		color: white;
	}
	#debug {
		position: fixed;
		bottom: 20px;
		left: 20px;
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

<script lang="ts">
	import { types } from "$lib/state";
	import type { Table } from "$lib/state";
	import { isSelecting, hoveredElement, selectedElement } from "$lib/state";

	import SortableList from "./SortableList.svelte";
	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();
	export let handleElementClick: (event: Event, fromName: string, node?: HTMLElement, fromId?: number) => void; // Fonction pour gérer le clic sur l'élément
	export let startCreatingRelation: (from: HTMLElement) => void;
	import Input from "./Input.svelte";
	import Dropdown from "./Dropdown.svelte";
	export let index: number;
	export let table: Table;
	export let elements: { [key: string]: HTMLElement } = {};

	export let readOnly: boolean = false;
	function getType(columnType: keyof typeof types): string {
		return types[columnType] || columnType;
	}

	function sortFieldsByid(fields: Table["fields"]) {
		return fields.sort((a, b) => a.id - b.id);
	}
	let sortedFields = sortFieldsByid(table.fields);

	function getIndex(index: number): string {
		return index === 1 ? "PK" : "FK";
	}
	const options = Object.keys(types);

	function addNewItem(index: number) {
		dispatch("create", { index });
	}

	function deleteTable(index: number) {
		dispatch("delete", { index });
	}

	function sortList(event: CustomEvent) {
		sortedFields = event.detail;
	}

	function removeLink(table: string, column: string, id: number) {
		dispatch("removeLink", { table, column, id });
	}

	function handleClick(name: string, id: number) {
		$isSelecting = !$isSelecting
		if($isSelecting) {
			selectedElement.set({ name, element: elements[name], id, table: table.name, column: name });

			startCreatingRelation(elements[name]);
		} else {
			selectedElement.set({
				name: name,
				element: elements[name],
				id: id,
				table: table.name,
			});
		}
	}

	function handleMouseEnter(columnName: string) {
		hoveredElement.set({ table: table.name, column: columnName });
	}

	function handleMouseLeave() {
		hoveredElement.set({ table: null, column: null });
	}
</script>

<main bind:this={elements[table.name]}>
	<SortableList list={sortedFields} {elements} tablename={table.name} on:sort={sortList} let:item let:index>
		<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
		<div
			class="line"
			role="main"
			on:keypress={() => {}}
			on:click={(event) => handleElementClick(event, `${table.name}-${item.name}`, elements[`${table.name}-${item.name}`], item.id)}
			on:mouseenter={() => handleMouseEnter(item.name)}
			on:mouseleave={handleMouseLeave}
			class:selected={$isSelecting && `${table.name}-${item.name}` === $selectedElement.name}
			class:hovered={$isSelecting && $hoveredElement.column === item.name && $hoveredElement.table === table.name}
		>
			<span class="item name">
				<Input type="text" value={item.name} layout="flex" readonly={!readOnly} />
			</span>
			<span class="item type">
				<Dropdown {options} layout="auto" type={getType(item.type)} selected={item.type} bind:editable={readOnly} value={item.length} />
			</span>
			<span class="item isNull" class:null={item.defaultValue === "NULL"}>{item.defaultValue !== undefined ? item.defaultValue : ""}</span>
			{#if item.index}
				<span class:blue={item.index === 2} class="item key">{getIndex(item.index)}</span>
			{/if}
			{#if readOnly}
				{#if !item.linked}
					<button class="item link" on:click|stopPropagation={() => handleClick(`${table.name}-${item.name}`, item.id)}>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="s-WdYVzRglSv5Z">
							<path d="M16 17L22 11L16 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="s-WdYVzRglSv5Z"></path>
							<path d="M3.91164 19.3885C4.29807 17.7083 5.04197 16.1312 6.09271 14.7644C7.14345 13.3976 8.47636 12.2733 10.0007 11.468C11.525 10.6626 13.205 10.1952 14.9262 10.0975C16.6474 9.99977 18.3695 10.2741 19.9752 10.9017" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="s-WdYVzRglSv5Z"></path>
						</svg>
					</button>
				{:else}
					<button class="item link" on:click={() => removeLink( table.name, item.name, item.id)}>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					</button>
				{/if}
			{/if}
		</div>
	</SortableList>
</main>

{#if readOnly}
	<div class="group-buttons">
		<button class="btn blue" on:click|self={() => addNewItem(index)}>Add item</button>
		<button class="btn" on:click={() => deleteTable(index)}>Delete</button>
	</div>
{/if}

<style lang="scss">
	.group-buttons {
		display: flex;
		gap: 10px;
		padding-top: 10px;
	}
	.line {
		border-radius: 6px;
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 4px 8px;
		gap: 8px;
		height: 27px;
		outline: 2px solid transparent;
		&.selected {
			outline-color: #1371ff;
		}
		&.hovered {
			background: rgba(255, 255, 255, 0.07);
		}
	}
	.btn {
		color: #fff;
		font-family: Inter, sans-serif;
		border: 0;
		width: 100%;
		height: 32px;
		cursor: pointer;
		border-radius: 8px;
		background: #363841;
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.005em;
		&:hover {
			background: #464b55;
		}
		&.blue {
			background: #1371ff;
			&:hover {
				background: #0f5fdd;
			}
		}
	}
	main {
		user-select: none;
		-webkit-user-drag: none;
		display: grid;
		padding: 10px;
		background: #252629;
		width: 400px;
		border-radius: 10px;
		border: 2px solid #363841;
	}

	.item {
		font-family: "SF Mono";
		font-style: normal;
		font-weight: 300;
		font-size: 14px;
		line-height: 17px;
		border: 0;
		padding: 0;
		color: #ffffff;
		flex: none;
		flex-grow: 0;
		&.link {
			cursor: pointer;
			aspect-ratio: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 6px;
			background: #3e4147;
			width: 18px;
			height: 18px;
			color: #9e9e9e;
			svg {
				width: 10px;
				height: 10px;
			}
			&:hover {
				color: #fff;
			}
		}
		&.name {
			flex-basis: 100px;
		}
		&.type {
			flex-basis: 120px;
		}
		&.isNull {
			flex-grow: 1;
			flex-basis: auto;
		}
		&.key {
			flex-basis: auto;
		}
		&.blue {
			color: #1371ff;
		}
		&.null {
			color: #9e9e9e;
		}
	}
	.group-buttons {
		display: flex;
		button {
			appearance: none;
			background-color: inherit;
			aspect-ratio: 1;
			border: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 6px;
			cursor: pointer;
			background: #3e4147;
			&:hover {
				background-color: #464b55;
			}
			svg {
				width: 16px;
				height: 16px;
				color: #fff;
			}
		}
	}
	:global(.no-select) {
		user-select: none;
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
	}
</style>

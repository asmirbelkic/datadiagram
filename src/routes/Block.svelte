<script lang="ts">
	import { types } from "$lib/state";

	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();
	import Input from "./Input.svelte";
	import Dropdown from "./Dropdown.svelte";
	import type { Table } from "$lib/state";
	import { clickOutside } from "$lib/util";

	export let index: number;
	export let table: Table;
	export let elements: { [key: string]: HTMLElement } = {};
	export let readOnly: boolean = false;
	function getType(columnType: keyof typeof types): string {
		return types[columnType] || columnType;
	}

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
</script>

<main bind:this={elements[table.name]} use:clickOutside={() => (readOnly = false)} class:focus={readOnly}>
	<div class="block">
		{#each table.fields as column, i}
			<div class="item" class:active={column.linked} id={`${table.name}-${column.name}`} bind:this={elements[`${table.name}-${column.name}`]}>
				<span>
					<Input type="text" value={column.name} layout="flex" readonly={!readOnly} />
				</span>
				<span>
					<Dropdown {options} layout="auto" type={getType(column.type)} bind:selected={column.type} bind:editable={readOnly} value={column.length} />
				</span>
				<span class:null={column.defaultValue === "NULL"}>{column.defaultValue !== undefined ? column.defaultValue : ""}</span>
				{#if column.index}
					<span class:blue={column.index === 2}>{getIndex(column.index)}</span>
				{/if}
			</div>
		{/each}
	</div>
	{#if readOnly}
		<div class="group-buttons">
			<button class="btn blue" on:click={() => addNewItem(index)}>Add item</button>
			<button class="btn" on:click={() => deleteTable(index)}>Delete</button>
		</div>
	{/if}
</main>

<style lang="scss">
	.group-buttons {
		display: flex;
		gap: 10px;
		margin-top: 10px;
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
		&.focus {
			h5 {
				color: #fff;
				background: rgba(89, 96, 110, 0.3);
			}
			.block {
				border-color: #1371ff;
			}
		}
	}

	.block {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: 10px;
		background: #252629;
		width: 360px;
		border-radius: 10px;
		border: 2px solid #363841;

		.item {
			border-radius: 6px;
			width: 100%;
			display: grid;
			grid-template-columns: minmax(100px, 1fr) minmax(130px, 1fr) 1fr auto;
			flex-direction: row;
			align-items: center;
			padding: 4px 8px;
			gap: 8px;
			flex: none;
			order: 0;
			flex-grow: 1;
			&.active {
				background: rgba(255, 255, 255, 0.05);
			}
			span {
				font-family: "SF Mono";
				font-style: normal;
				font-weight: 300;
				font-size: 14px;
				line-height: 17px;
				color: #ffffff;
				flex: none;
				flex-grow: 1;
				&.blue {
					color: #1371ff;
				}
				&.null {
					color: #9e9e9e;
				}
			}
			.group-buttons {
				z-index: 999;
				position: absolute;
				left: calc(100% - 10px);
				display: none;
				padding: 4px;
				border-radius: 8px;
				border: 2px solid #464b55;
				background: #252629;
				box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px;
				gap: 4px;
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
			&:hover {
				.group-buttons {
					display: flex;
				}
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

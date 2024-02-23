<script lang="ts">
	import { types } from "$lib/state";

	import type { Table } from "$lib/state";

	export let table: Table;
	export let elements: { [key: string]: HTMLElement } = {};

  function getType(columnType: keyof typeof types): string {
    return types[columnType] || columnType;
  }

  function getIndex(index: number): string {
    return index === 1 ? "PK" : "FK";
  }
</script>

<div class="block" bind:this={elements[table.name]}>
  <h5>{table.name}</h5>
	{#each table.fields as column (column.name)}
		<div class="item" class:active={column.linked} id={`${table.name}-${column.name}`} bind:this={elements[`${table.name}-${column.name}`]}>
			<span>{column.name}</span>
			<span class={column.type}>
				{getType(column.type)}{#if column.length}({column.length}){/if}
			</span>
			<span class:null={column.defaultValue === "NULL"}>{column.defaultValue !== undefined ? column.defaultValue : ""}</span>
			{#if column.index}
				<span class:blue={column.index === 2}>{getIndex(column.index)}</span>
			{/if}
			<!-- <div class="group-buttons">
				<button>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M12 12V4M12 12V20M12 12H20M12 12H4" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</button>
				<button>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M19 11L9.08787 20.9121C9.03161 20.9684 8.9553 21 8.87574 21H3.3C3.13432 21 3 20.8657 3 20.7L3 15.1242C3 15.0447 3.03161 14.9684 3.08787 14.9121L13 4.99997M19 11L21.2929 8.70708C21.6834 8.31655 21.6834 7.68339 21.2929 7.29286L16.7071 2.70708C16.3166 2.31655 15.6834 2.31655 15.2929 2.70708L13 4.99997M19 11L13 4.99997" stroke="currentcolor" stroke-width="2" />
					</svg>
				</button>
				<button>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M6 9V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V9M14 10V17M10 10V17M4 6H20M16 6V5C16 3.89543 15.1046 3 14 3H11.5H10C8.89543 3 8 3.89543 8 5V6" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</button>
			</div> -->
		</div>
	{/each}
</div>

<style lang="scss">
	.block {
		user-select: none;
		-webkit-user-drag: none;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: 10px;
		background: #252629;
		width: 340px;
		border-radius: 10px;
		border: 2px solid #464b55;
		h5 {
			position: absolute;
			left: 0;
			margin: 0;
			font-size: 12px;
			font-weight: 300;
			margin-top: -35px;
			color: #9e9e9e;
		}
		&.focus {
			border-color: #1371ff;
		}
		.item {
			border-radius: 6px;
			width: 100%;
			display: grid;
			grid-template-columns: minmax(100px, 1fr) minmax(120px, 1fr) 1fr auto;
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
				&.int {
					color: #efc900;
				}
				&.varchar {
					color: #f17400;
				}
				&.null {
					color: #9e9e9e;
				}
				&.timestamp {
					color: #00d0ab;
				}
				&.blue {
					color: #1371ff;
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

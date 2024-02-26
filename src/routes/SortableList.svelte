<script lang="ts">
	import { flip } from "svelte/animate";
	import { createEventDispatcher } from "svelte";
	import { relations } from "$lib/state";

	export let list: any[];
	export let tablename: string;
	export let elements: { [key: string]: HTMLElement } = {};

	let isOver: string | boolean = false;

	const dispatch = createEventDispatcher();

	function getDraggedParent(node: any) {
		if (!node.dataset.index) {
			return getDraggedParent(node.parentNode);
		} else {
			return { ...node.dataset };
		}
	}

	function onDragStart(e: DragEvent) {
		// @ts-ignore
		const dragged = getDraggedParent(e.target);
		e.dataTransfer?.setData("source", dragged?.index.toString());
	}

	function onDragOver(e: DragEvent) {
		// @ts-ignore
		const id = e.target.dataset?.id;
		const dragged = getDraggedParent(e.target);
		isOver = dragged?.id ?? false;
	}

	function onDragLeave(e: DragEvent) {
		const dragged = getDraggedParent(e.target);
		isOver === dragged.id && (isOver = false);
	}

	function onDrop(e: DragEvent) {
		isOver = false;
		const dragged = getDraggedParent(e.target);
		reorder({
			from: e.dataTransfer?.getData("source"),
			to: dragged.index,
		});
	}

	const reorder = ({ from, to }: any) => {
		const newList = [...list];
		newList[from] = [newList[to], (newList[to] = newList[from])][0];

		dispatch("sort", newList);
	};

	// 	export const relations = [
	// 	{ from: "user-id", to: "like-user_id" },
	// 	{ from: "post-id", to: "like" },
	// ];
</script>

{#if list?.length}
	{#each list as item, index (item.id)}
		<div
			id={`${tablename}-${item.name}`}
			bind:this={elements[`${tablename}-${item.name}`]}
			class="item"
			class:over={item.id === isOver}
			class:active={item.linked}
			data-index={index}
			data-id={item.id}
		>
			<!-- {#if readOnly}
				<span class="item move">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M9 13C9.55228 13 10 12.5523 10 12C10 11.4477 9.55228 11 9 11C8.44772 11 8 11.4477 8 12C8 12.5523 8.44772 13 9 13Z" stroke="#61646e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
						<path d="M15 13C15.5523 13 16 12.5523 16 12C16 11.4477 15.5523 11 15 11C14.4477 11 14 11.4477 14 12C14 12.5523 14.4477 13 15 13Z" stroke="#61646e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
						<path d="M9 6C9.55228 6 10 5.55228 10 5C10 4.44772 9.55228 4 9 4C8.44772 4 8 4.44772 8 5C8 5.55228 8.44772 6 9 6Z" stroke="#61646e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
						<path d="M15 6C15.5523 6 16 5.55228 16 5C16 4.44772 15.5523 4 15 4C14.4477 4 14 4.44772 14 5C14 5.55228 14.4477 6 15 6Z" stroke="#61646e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
						<path d="M9 20C9.55228 20 10 19.5523 10 19C10 18.4477 9.55228 18 9 18C8.44772 18 8 18.4477 8 19C8 19.5523 8.44772 20 9 20Z" stroke="#61646e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
						<path d="M15 20C15.5523 20 16 19.5523 16 19C16 18.4477 15.5523 18 15 18C14.4477 18 14 18.4477 14 19C14 19.5523 14.4477 20 15 20Z" stroke="#61646e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</span>
			{/if} -->
			<slot {item} {index}/>
		</div>
	{/each}
{:else}
	<p class="text-center my-12 text-lg font-bold">No items</p>
{/if}

<style lang="scss">
	div {
		border-radius: 6px;
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 4px 8px;
		gap: 8px;
		height: 27px;
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
			flex-grow: 0;
			&.move {
				display: flex;
				align-items: center;
				flex-basis: fit-content;
			}
			&.link {
				cursor: pointer;
				aspect-ratio: 1;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 6px;
				background: #3e4147;
				width: 18px;
				color: #9e9e9e;
				height: 18px;
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
</style>

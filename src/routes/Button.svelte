<script lang="ts">
	export let handle: () => void;
	export let disabled: boolean = false;
	export let value: string = '';
	export let classNames = $$restProps.class;
	export let layout: "auto" | "flex" | "fill" | "fit" | number = 175;
	const fromLayout = () => {
		if (layout == "flex") return "flex-grow: 1;";
		if (layout == "fill") return "width: 100%;";
		if (layout == "fit") return "width: fit-content;";
		else return `width: ${layout}px;`;
	}
	let styles = fromLayout() + `; ${$$restProps.style}`
</script>

<button on:click={handle} disabled={disabled} class={classNames} style={styles}>{value}</button>
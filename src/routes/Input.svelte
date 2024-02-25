<script lang="ts">
	export let placeholder: string = "";
	export let layout: "auto" | "flex" | "fill" | "fit" | number = 175;
	export let type: "text" | "number" = "text";
	export let value: string | number | null = null;
	export let readonly: boolean = false;
	const fromLayout = () => {
		if (layout === "auto") {
			// Utiliser l'opérateur de coalescence nulle pour fournir une valeur par défaut si value est null
			const length = value?.toString().length ?? 3;
			return `width: ${length + 1}ch;`;
		}
		if (layout == "flex") return "flex-grow: 1;";
		if (layout == "fill") return "width: 100%;";
		if (layout == "fit") return "width: fit-content;";
		else return `width: ${layout}px;`;
	};

	let ref: HTMLInputElement;
</script>

<input
	bind:this={ref}
	{placeholder}
	bind:value
	autocomplete="false"
	spellcheck="false"
	{readonly}
	style={fromLayout()}
	on:input={() => {
		if (type == "number") ref.value = ref.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
		if (type == "number" && ref.value.length > 3) ref.value = ref.value.slice(0, 3);
	}}
/>

<style lang="scss">
	input {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 10px;

		height: 17px;
		width: 100%;
		background: transparent;
		border-radius: 4px;
		border: 1px solid transparent;
		outline: none;
		box-sizing: border-box;

		font-family: "SF Mono";
		font-style: normal;
		font-weight: 300;
		font-size: 14px;
		line-height: 17px;

		color: inherit;

		&:not([readonly]) {
			&:hover {
				background: #414141;
			}
			&:focus,
			&:active {
				background: #414141;
			}
		}

		&::placeholder {
			color: #777777;
		}

		&::-webkit-outer-spin-button,
		&::-webkit-inner-spin-button {
			-webkit-appearance: none;
			margin: 0;
		}

		&[type="number"] {
			-moz-appearance: textfield;
		}
	}
</style>

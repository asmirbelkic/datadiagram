<script lang="ts">
	export let placeholder: string = "";
	export let layout: "auto" | "flex" | "fill" | "fit" | number = 175;
	export let type: "text" | "number" = "text";
	export let value: string | number | null = null;
	export let readonly: boolean = false;
	export let autofocus: boolean = false;

	const fromLayout = () => {
		if (layout === "auto" && type === "number") {
			// Utiliser l'opérateur de coalescence nulle pour fournir une valeur par défaut si value est null
			const length = value?.toString().length ?? 4;
			return `width: ${length + 2}ch;`;
		}
		if (layout === "auto") {
			const desiredLength = Math.min(Math.max((value?.toString().length ?? 0) + 1, 4), 16);
			const newWidth = `${desiredLength}`;
			return `width: ${newWidth}ch;`
		}
		if (layout == "flex") return "flex-grow: 1;";
		if (layout == "fill") return "width: 100%;";
		if (layout == "fit") return "width: fit-content;";
		else return `width: ${layout}px;`;
	};

	let ref: HTMLInputElement;

	function handleInput() {
		if (type === "number" && value !== null && typeof value === "string") {
			let numericValue = parseFloat(value); // Convertit la chaîne en nombre
			if (numericValue > 65535) {
				numericValue = 65535; // Applique la valeur maximale
				value = numericValue.toString(); // Convertit le nombre en chaîne
			}

			// Limiter la valeur à 65535 caractères maximum.
			value = value
				.slice(0, 65535)
				.replace(/[^0-9.]/g, "")
				.replace(/(\..*)\./g, "$1");
			// Calculer la longueur souhaitée avec un minimum de 4ch et un maximum de 8ch.
			const desiredLength = Math.min(Math.max(value.length + 1, 4), 8);
			const newWidth = `${desiredLength}ch`;
			ref.style.width = newWidth;
		}
		if (layout === "auto") {
			const desiredLength = Math.min(Math.max((value?.toString().length ?? 0) + 1, 4), 16);
			const newWidth = `${desiredLength}ch`;
			ref.style.width = newWidth;
		}
	}

	let styles = fromLayout();
	if ($$restProps.style) {
			styles += `; ${$$restProps.style}`;
	}
</script>

<input bind:this={ref} {placeholder} {autofocus} bind:value autocomplete="false" spellcheck="false" {readonly} maxlength={type === "number" ? 65535 : null} style={styles} on:input={handleInput} />

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

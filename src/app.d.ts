// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

// leader-line.d.ts
declare module "leader-line-new" {
	export default class LeaderLine {
		constructor(startElement: HTMLElement, endElement: HTMLElement, options?: object);
		position(): void;
		remove(): void;
		setOptions(options: object): void;
		start: HTMLElement;
		end: HTMLElement;
		_id: number;
	}
}

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};

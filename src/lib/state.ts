import LeaderLine from "leader-line-new";
import { writable, type Writable } from "svelte/store";
export const focusedBlock = writable<string | null>(null);


interface Editor {
  width: number;
  height: number;
  element?: HTMLElement; // Ajoutez cette ligne pour stocker l'élément
}

// Initialisez le store avec un objet vide respectant l'interface, ou null si vous préférez.
export const editor = writable<Editor>({ width: 0, height: 0 });

// Définir un type pour les positions qui accepte des clés dynamiques de type string
export interface Positions {
  [key: string]: {
    left: number;
    top: number;
  };
}

export const positions = writable<Positions>({});

export interface Column {
	id: number;
	name: string;
	type: "int" | "varchar" | "timestamp" | "text";
	length?: number;
	defaultValue?: string;
	linked?: boolean;
	index?: number;
}

export interface Table {
	name: string;
	fields: Column[];
	elements?: HTMLElement;
	position: [number, number];
	readOnly?: boolean | null;
}

export interface relation {
	id: number | null;
	from: string;
	to: string;
}

export const index = {
	"1": "PRIMARY KEY",
	"2": "FOREIGN KEY",
};

export const types = {
	int: "int",
	varchar: "varchar",
	timestamp: "timestamp",
	text: "text",
};

export const relations = writable<Array<relation>>([
	{ id: null, from: "user-id", to: "like-user_id" },
	{ id: null, from: "post-id", to: "like" },
]);

export const cards = writable<Array<Table>>([
	{
		name: "user",
		fields: [
			{ id:1, name: "id", type: "int", index: 1, linked: true},
			{ id:2, name: "username", type: "varchar", length: 50 },
			{ id:3, name: "email", type: "varchar", length: 250 },
			{ id:4, name: "phone", type: "varchar", length: 250, index: 1, defaultValue: "NULL" },
			{ id:5, name: "created_at", type: "timestamp" },
		],
		position: [0, 0],
	},
	{
		name: "like",
		fields: [
			{ id:1,name: "user_id", type: "int", index: 2 },
			{ id:2,name: "post_id", type: "int", index: 2 },
			{ id:3,name: "created_at", type: "timestamp" },
		],
		position: [450, 150],
	},
	{
		name: "post",
		fields: [
			{ id: 1, name: "id", type: "int", index: 1, linked: true},
			{ id: 2, name: "title", type: "varchar", length: 50 },
			{ id: 3, name: "content", type: "text" },
			{ id: 4, name: "created_at", type: "timestamp" },
		],
		position: [900, 280],
	},
]);

export let isSelecting = writable(false);
// Is selection true or false and what is the type of the selection (table or column)
// export let selectedElement = writable<null | string>(null);
export let selectedElement = writable<{
	element?: HTMLElement | null;
	id?: number | null;
	name: string | null;
	table?: string | null;
	column?: string | null;
}>(
	{
		element: null,
		id: null,
		name: null,
		table: null,
		column: null,
	}
)
// export let hoveredElement = writable<null | string>(null);
export const hoveredElement = writable<{ table: string | null; column: string | null }>({ table: null, column: null });
export const tempLine = writable<LeaderLine | null>(null);
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
	name: string;
	type: "int" | "varchar" | "timestamp" | "text";
	length?: number;
	defaultValue?: string;
	index?: number;
	linked?: boolean;
}

export interface Table {
	name: string;
	fields: Column[];
	elements?: HTMLElement;
	position: [number, number];
	readOnly?: boolean | null;
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

export const relations = [
	{ from: "user-id", to: "like-user_id" },
	{ from: "post-id", to: "like" },
];

export const cards = writable<Array<Table>>([
	{
		name: "user",
		fields: [
			{ name: "id", type: "int", index: 1, linked: true },
			{ name: "username", type: "varchar", length: 50 },
			{ name: "email", type: "varchar", length: 250 },
			{ name: "phone", type: "varchar", length: 250, index: 1, defaultValue: "NULL" },
			{ name: "created_at", type: "timestamp" },
		],
		position: [0, 0],
	},
	{
		name: "like",
		fields: [
			{ name: "user_id", type: "int", index: 2 },
			{ name: "post_id", type: "int", index: 2 },
			{ name: "created_at", type: "timestamp" },
		],
		position: [450, 150],
	},
	{
		name: "post",
		fields: [
			{ name: "id", type: "int", index: 1, linked: true },
			{ name: "title", type: "varchar", length: 50 },
			{ name: "content", type: "text" },
			{ name: "created_at", type: "timestamp" },
		],
		position: [900, 280],
	},
]);

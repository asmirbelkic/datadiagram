import legacy from "@vitejs/plugin-legacy";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		sveltekit(),
		legacy({ 'node_modules/leader-line-new/leader-line.min.js': 'LeaderLine' } as Record<string, string>),
	 ],
});

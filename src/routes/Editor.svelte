<script lang="ts">
  import { onMount } from 'svelte';
  import { editor } from '$lib/state';
  import Window from './Window.svelte';

  let editorElement: HTMLElement;

  onMount(() => {
    const updateBounds = () => {
      // Mettez à jour le store pour inclure l'élément editorElement en plus de ses dimensions
      editor.set({
        width: editorElement.clientWidth,
        height: editorElement.clientHeight,
        element: editorElement // Ajoutez cette ligne
      });
    };

    window.addEventListener('resize', updateBounds);
    updateBounds();

    return () => {
      window.removeEventListener('resize', updateBounds);
    };
  });
</script>

<main bind:this={editorElement} class="editor">
  <slot />
</main>

<style lang="scss">
  main {
    position: relative;
    height: 750px;
    width: 1250px;
  }
</style>

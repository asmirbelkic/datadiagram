export function clickOutside(
  node: HTMLElement,
  handler: () => void
): { destroy: () => void } {
  const onClick = (event: MouseEvent) =>
    node &&
    !node.contains(event.target as HTMLElement) &&
    !event.defaultPrevented &&
    handler();

  document.addEventListener('click', onClick, true);

  return {
    destroy() {
      document.removeEventListener('click', onClick, true);
    },
  };
}

export function quitOnEscape(node: HTMLElement, handler: () => void) {
	const onKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			handler();
		}
	};

	node.addEventListener('keydown', onKeydown);

	return {
		destroy() {
			node.removeEventListener('keydown', onKeydown);
		},
	};
}
export const drawArrowAction = (node: HTMLElement) => {
	const arrowCounters: { [key: string]: number } = {};

	const update = ({ fromElement, toElement, wrapper }: { fromElement: HTMLElement; toElement: HTMLElement; wrapper: HTMLElement }) => {
		const arrowWidth = 5;
		const arrowHeight = 5.5;
		const offset = 10;
		const toId = toElement.getAttribute("id");

		if (!arrowCounters[toId]) {
			arrowCounters[toId] = 0;
		}
		const arrowIndex = arrowCounters[toId]++;
		const arrowSpacing = 5;
		const wrapperRect = wrapper.getBoundingClientRect();
		const fromRect = fromElement.getBoundingClientRect();
		const toRect = toElement.getBoundingClientRect();

		const fromSide = fromRect.right < toRect.left ? "right" : "left";
		const toSide = toRect.left > fromRect.right ? "left" : "right";

		const startX = fromSide === "right" ? fromRect.right - wrapperRect.left : fromRect.left - wrapperRect.left;
		const startY = fromRect.top - wrapperRect.top + fromRect.height / 2;
		const endX = toSide === "left" ? toRect.left - wrapperRect.left : toRect.right - wrapperRect.left;
		const endY = toRect.top - wrapperRect.top + toRect.height / 2;

		const midX = (startX + endX) / 2;

		const svgNS = "http://www.w3.org/2000/svg";
		let svg = document.createElementNS(svgNS, "svg");
		let path = document.createElementNS(svgNS, "path");

		svg.setAttribute("width", wrapperRect.width + "px");
		svg.setAttribute("height", wrapperRect.height + "px");
		svg.style.position = "absolute";
		svg.style.top = "0";
		svg.style.left = "0";
		svg.style.pointerEvents = "none";
		svg.style.overflow = "visible";
		const endYAdjusted = endY + arrowIndex * arrowSpacing;

		const arrowPath = `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endYAdjusted} L ${endX} ${endYAdjusted}`;

		path.setAttribute("d", arrowPath);
		path.setAttribute("stroke", "#666666");
		path.setAttribute("stroke-linecap", "round");
		path.setAttribute("stroke-linejoin", "round");
		path.setAttribute("stroke-width", "2");
		path.setAttribute("stroke-dasharray", "4,4");
		path.setAttribute("fill", "none");

		let markerEnd = document.createElementNS(svgNS, "marker");
		markerEnd.setAttribute("id", "arrowhead");
		markerEnd.setAttribute("markerWidth", arrowWidth);
		markerEnd.setAttribute("markerHeight", arrowHeight);
		markerEnd.setAttribute("refX", "0");
		markerEnd.setAttribute("refY", "2.75");
		markerEnd.setAttribute("orient", "auto");

		let polygon = document.createElementNS(svgNS, "polygon");
		polygon.setAttribute("points", "0 0, 5 2.75, 0 5.5");
		polygon.setAttribute("fill", "#666666");

		markerEnd.appendChild(polygon);
		svg.appendChild(markerEnd);
		path.setAttribute("marker-end", "url(#arrowhead)");

		let markerStart = document.createElementNS(svgNS, "circle");
		markerStart.setAttribute("cx", startX);
		markerStart.setAttribute("cy", startY);
		markerStart.setAttribute("r", "3");
		markerStart.setAttribute("fill", "#666666");

		svg.appendChild(markerStart);
		svg.appendChild(path);

		wrapper.appendChild(svg);
	};

	return {
		update,
	};
};

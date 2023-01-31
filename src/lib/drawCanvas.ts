import type { FramePath } from './FramePath';
import type { LinePath } from './LinePath';
import { getPathLocation } from './getPathLocation';
import { mouseIsInCircle } from './mouseIsInCircle';

const drawLine = (
	ctx: CanvasRenderingContext2D,
	framePaths: FramePath[],
	start: LinePath,
	end: LinePath,
	linkHandle?: {
		show: boolean;
		mousePosition?: {
			x: number | null;
			y: number | null;
		};
	} | null
) => {
	if (!ctx) {
		console.error('Something went wrong when adding line to canvas');
		return;
	}
	// get referenced start and end locations
	start = getPathLocation(start, framePaths);
	end = getPathLocation(end, framePaths);

	ctx.beginPath();
	ctx.moveTo(Number(start.x), Number(start.y));
	ctx.lineTo(Number(end.x), Number(end.y));

	ctx.stroke();
	if (typeof linkHandle !== 'undefined' && linkHandle?.show) {
		const { mousePosition } = linkHandle;
		// draw circle
		const isEndHovered = mousePosition
			? mouseIsInCircle(mousePosition?.x, mousePosition?.y, Number(end.x), Number(end.y), 5)
			: false;

		const isStartHovered = mousePosition
			? mouseIsInCircle(mousePosition?.x, mousePosition?.y, Number(start.x), Number(start.y), 5)
			: false;
		ctx.beginPath();

		ctx.fillStyle = isStartHovered ? 'red' : 'black';
		ctx.arc(Number(start.x), Number(start.y), 5, 0, 2 * Math.PI);
		ctx.fill();
		ctx.beginPath();
		ctx.fillStyle = isEndHovered ? 'red' : 'black';
		ctx.arc(Number(end.x), Number(end.y), 5, 0, 2 * Math.PI);
		ctx.fill();
	}
};

export const drawCanvas = (
	canvas: HTMLCanvasElement,
	framePaths: FramePath[],
	linkHandle?: {
		show: boolean;
		mousePosition?: {
			x: number | null;
			y: number | null;
		};
	} | null,
	newPath?: LinePath | null
) => {
	const ctx = canvas.getContext('2d');
	if (!ctx) {
		console.error('Something went wrong when adding line to canvas');
		return;
	}
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	framePaths.forEach((path) => {
		drawLine(ctx, framePaths, path.start, path.end, linkHandle);
	});
	if (newPath && linkHandle?.mousePosition) {
		const { x, y } = linkHandle.mousePosition;
		if (x === null || y === null) return;
		drawLine(ctx, framePaths, newPath, { x: x, y: y });
	}
};

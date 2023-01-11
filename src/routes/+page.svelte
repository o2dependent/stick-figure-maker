<script lang="ts">
	import { mouseIsInCircle } from '$lib/mouseIsInCircle';

	type LinePath = { x: number | string; y: number | string };

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;

	let newPath: LinePath | null = null;
	let paths: {
		start: LinePath;
		end: LinePath;
	}[] = [];

	$: if (canvas) {
		ctx = canvas.getContext('2d');
	}

	const drawLine = (
		e: MouseEvent,
		start: LinePath,
		end: LinePath,
		showLinkHandle: boolean = false
	) => {
		if (!ctx) {
			console.error('Something went wrong when adding line to canvas');
			return;
		}
		ctx.beginPath();
		ctx.moveTo(Number(start.x), Number(start.y));
		ctx.lineTo(Number(end.x), Number(end.y));

		ctx.stroke();
		if (showLinkHandle) {
			// draw circle
			const isEndHovered = mouseIsInCircle(e.offsetX, e.offsetY, Number(end.x), Number(end.y), 5);

			const isStartHovered = mouseIsInCircle(
				e.offsetX,
				e.offsetY,
				Number(start.x),
				Number(start.y),
				5
			);
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

	const onCanvasClick = (e: MouseEvent) => {
		if (!ctx) {
			console.error('Something went wrong when adding line to canvas');
			return;
		}
		if (!newPath) {
			// add new path
			newPath = { x: e.offsetX, y: e.offsetY };
		} else {
			paths = [...paths, { start: newPath, end: { x: e.offsetX, y: e.offsetY } }];
			newPath = null;
			paths.forEach((path) => {
				drawLine(e, path.start, path.end, true);
			});
		}
	};

	const onCanvasMouseMove = (e: MouseEvent) => {
		if (!ctx) {
			console.error('Something went wrong when adding line to canvas');
			return;
		}

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		paths.forEach((path) => {
			drawLine(e, path.start, path.end, true);
		});
		if (newPath) {
			drawLine(e, newPath, { x: e.offsetX, y: e.offsetY });
		}
	};
</script>

<canvas
	class="mx-auto border border-red-500"
	on:click={onCanvasClick}
	on:mousemove={onCanvasMouseMove}
	bind:this={canvas}
	width="800"
	height="800"
/>

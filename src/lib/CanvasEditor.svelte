<script lang="ts">
	import { mouseIsInCircle } from '$lib/mouseIsInCircle';
	import { onMount } from 'svelte';
	import { createNewPath } from './createNewPath';
	import { drawCanvas } from './drawCanvas';
	import type { FramePath } from './FramePath';
	import { frames } from './frames';
	import { getPathLocation } from './getPathLocation';
	import type { LinePath } from './LinePath';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;

	let mousePosition: { x: number | null; y: number | null } = {
		x: null,
		y: null
	};
	let frameIndex = 0;
	let newPath: LinePath | null = null;
	let paths: FramePath[] = [];

	$: {
		console.log('set paths to frames when frameIndex changes');
		const newPaths = $frames?.[0] ?? null;
		if (!newPaths) {
			const newFrames = [...$frames];
			newFrames[frameIndex] = [];
			frames.set(newFrames);
		}
		paths = newPaths ?? [];
	}

	$: {
		console.log('set frames to paths on change');
		const newFrames = [...$frames];
		newFrames[frameIndex] = paths;
		frames.set(newFrames);
	}

	$: if (canvas) {
		ctx = canvas.getContext('2d');
	}

	onMount(() => {
		const drawLoop = () => {
			drawCanvas(
				canvas,
				$frames[frameIndex],
				{
					mousePosition,
					show: true
				},
				newPath
			);
			requestAnimationFrame(drawLoop);
		};
		requestAnimationFrame(drawLoop);
	});

	const drawLine = (
		start: LinePath,
		end: LinePath,
		linkHandle?: {
			show: boolean;
			mouseEvent?: MouseEvent;
		}
	) => {
		if (!ctx) {
			console.error('Something went wrong when adding line to canvas');
			return;
		}
		// get referenced start and end locations
		start = getPathLocation(start, paths);
		end = getPathLocation(end, paths);

		ctx.beginPath();
		ctx.moveTo(Number(start.x), Number(start.y));
		ctx.lineTo(Number(end.x), Number(end.y));

		ctx.stroke();
		if (typeof linkHandle !== 'undefined' && linkHandle?.show) {
			const { mouseEvent } = linkHandle;
			// draw circle
			const isEndHovered = mouseEvent
				? mouseIsInCircle(mouseEvent?.offsetX, mouseEvent?.offsetY, Number(end.x), Number(end.y), 5)
				: false;

			const isStartHovered = mouseEvent
				? mouseIsInCircle(
						mouseEvent?.offsetX,
						mouseEvent?.offsetY,
						Number(start.x),
						Number(start.y),
						5
				  )
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

	// const drawCanvas = (e?: MouseEvent) => {
	// 	if (!ctx) {
	// 		console.error('Something went wrong when adding line to canvas');
	// 		return;
	// 	}
	// 	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// 	paths.forEach((path) => {
	// 		drawLine(path.start, path.end, {
	// 			show: true
	// 		});
	// 	});
	// 	if (newPath && e) {
	// 		drawLine(newPath, { x: e.offsetX, y: e.offsetY });
	// 	}
	// };

	const onCanvasClick = (e: MouseEvent) => {
		if (!ctx) {
			console.error('Something went wrong when adding line to canvas');
			return;
		}
		if (!newPath) {
			newPath = createNewPath(e, paths);
		} else {
			// create new end path
			const end = createNewPath(e, paths);
			const start = newPath;
			// add new path to paths
			paths = [...paths, { id: crypto.randomUUID(), start, end }];
			newPath = null;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			paths.forEach((path) => {
				drawLine(path.start, path.end, {
					show: true,
					mouseEvent: e
				});
			});
		}
	};

	const onCanvasMouseMove = (e: MouseEvent) => {
		mousePosition = {
			x: e.offsetX,
			y: e.offsetY
		};
	};
</script>

{#each $frames ?? [] as frame, index}
	<button on:click={() => (frameIndex = index)}>Frame: {index}</button>
{/each}
<button on:click={() => (frameIndex = $frames?.length)}>Add Frame</button>

<canvas
	class="mx-auto border border-red-500"
	on:click={onCanvasClick}
	on:mousemove={onCanvasMouseMove}
	bind:this={canvas}
	width="800"
	height="800"
/>

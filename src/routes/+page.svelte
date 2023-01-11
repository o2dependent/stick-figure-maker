<script lang="ts">
	import { mouseIsInCircle } from '$lib/mouseIsInCircle';

	type LinePath = { x: number | string; y: number | string };

	const deliminator = '%_%';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;

	let newPath: LinePath | null = null;
	let paths: {
		id: string;
		start: LinePath;
		end: LinePath;
	}[] = [];

	$: if (canvas) {
		ctx = canvas.getContext('2d');
	}

	// get x or y value from reference string or number
	const getCoordinateValue = (value: string | number, key: 'x' | 'y'): number => {
		let newValue = value;
		// > check if value is a reference to another path
		if (typeof newValue === 'string') {
			// split the value to get the path id to search for and the location of the path
			const [pathId, location] = newValue.split(deliminator) as [string, 'start' | 'end'];
			// find path by id
			const path = paths.find(({ id }) => id === pathId);
			// if the path exists get the x or y value and set new value
			if (path) {
				newValue = path?.[location]?.[key];
				if (typeof newValue === 'string') {
					newValue = getCoordinateValue(newValue, key);
				}
			}
		}
		return newValue as number;
	};

	// find x and y coordinates of path
	const getPathLocation = (path: LinePath) => {
		let x = getCoordinateValue(path.x, 'x');
		let y = getCoordinateValue(path.y, 'y');
		return { x, y };
	};

	// create new path from mouse event with reference if mouse is within another path
	const createNewPath = (e: MouseEvent) => {
		let x: number | string = e?.offsetX;
		let y: number | string = e?.offsetY;
		paths.forEach(({ id, end, start }) => {
			// > check if the mouse is within another path end
			// check end
			const isEndHovered = mouseIsInCircle(e.offsetX, e.offsetY, Number(end.x), Number(end.y), 5);
			// if end is hovered set the x and y to the id of the path to be referenced later
			if (isEndHovered) {
				x = `${id}${deliminator}end`;
				y = `${id}${deliminator}end`;
			}
			// check start
			const isStartHovered = mouseIsInCircle(
				e.offsetX,
				e.offsetY,
				Number(start.x),
				Number(start.y),
				5
			);
			// if start is hovered set the x and y to the id of the path to be referenced later
			if (isStartHovered) {
				x = `${id}${deliminator}start`;
				y = `${id}${deliminator}start`;
			}
		});

		// return new path
		return { x, y };
	};

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
		// get referenced start and end locations
		start = getPathLocation(start);
		end = getPathLocation(end);

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
			newPath = createNewPath(e);
		} else {
			// create new end path
			const end = createNewPath(e);
			const start = newPath;
			// add new path to paths
			paths = [...paths, { id: crypto.randomUUID(), start, end }];
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

	$: console.log({ paths });
</script>

<canvas
	class="mx-auto border border-red-500"
	on:click={onCanvasClick}
	on:mousemove={onCanvasMouseMove}
	bind:this={canvas}
	width="800"
	height="800"
/>

<script lang="ts">
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;

	let newPath: { x: number; y: number } | null = null;

	$: if (canvas) {
		ctx = canvas.getContext('2d');
	}

	const onCanvasClick = (e: MouseEvent) => {
		if (!ctx) {
			console.error('Something went wrong when adding line to canvas');
			return;
		}
		if (!newPath) {
			ctx.beginPath();
			newPath = { x: e.offsetX, y: e.offsetY };
			ctx.moveTo(newPath.x, newPath.y);
		} else {
			ctx.lineTo(e.offsetX, e.offsetY);
			ctx.stroke();
			newPath = null;
		}
	};
</script>

<canvas on:click={onCanvasClick} bind:this={canvas} width="800" height="800" />

import { framePathDeliminator } from './framesConstants';
import { mouseIsInCircle } from './mouseIsInCircle';
import type { FramePath } from './FramePath';

// create new path from mouse event with reference if mouse is within another path
export const createNewPath = (e: MouseEvent, paths: FramePath[]) => {
	let x: number | string = e?.offsetX;
	let y: number | string = e?.offsetY;
	paths.forEach(({ id, end, start }) => {
		// > check if the mouse is within another path end
		// check end
		const isEndHovered = mouseIsInCircle(e.offsetX, e.offsetY, Number(end.x), Number(end.y), 5);
		// if end is hovered set the x and y to the id of the path to be referenced later
		if (isEndHovered) {
			x = `${id}${framePathDeliminator}end`;
			y = `${id}${framePathDeliminator}end`;
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
			x = `${id}${framePathDeliminator}start`;
			y = `${id}${framePathDeliminator}start`;
		}
	});

	// return new path
	return { x, y };
};

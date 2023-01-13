import type { FramePath } from './FramePath';
import { framePathDeliminator } from './framesConstants';

// get x or y value from reference string or number
export const getCoordinateValue = (
	value: string | number,
	key: 'x' | 'y',
	paths: FramePath[]
): number => {
	let newValue = value;
	// > check if value is a reference to another path
	if (typeof newValue === 'string') {
		// split the value to get the path id to search for and the location of the path
		const [pathId, location] = newValue.split(framePathDeliminator) as [string, 'start' | 'end'];
		// find path by id
		const path = paths.find(({ id }) => id === pathId);
		// if the path exists get the x or y value and set new value
		if (path) {
			newValue = path?.[location]?.[key];
			if (typeof newValue === 'string') {
				newValue = getCoordinateValue(newValue, key, paths);
			}
		}
	}
	return newValue as number;
};

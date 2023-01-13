import type { FramePath } from './FramePath';
import type { LinePath } from './LinePath';
import { getCoordinateValue } from './getCoordinateValue';

// find x and y coordinates of path
export const getPathLocation = (path: LinePath, paths: FramePath[]) => {
	const x = getCoordinateValue(path.x, 'x', paths);
	const y = getCoordinateValue(path.y, 'y', paths);
	return { x, y };
};

import type { LinePath } from './LinePath';

export type FramePath = {
	id: string;
	start: LinePath;
	end: LinePath;
};

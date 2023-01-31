import { writable } from 'svelte/store';
import type { FramePath } from './FramePath';

export const frames = writable<FramePath[][]>([]);

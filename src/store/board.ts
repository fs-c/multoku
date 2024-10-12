import { signal } from '@preact/signals';

type Cell = number | null;
export type Board = Cell[];

function createEmptyBoard(): Board {
    return Array.from({ length: 9 * 9 }, () => null);
}

export const board = signal(createEmptyBoard());

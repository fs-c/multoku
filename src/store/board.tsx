import { ReadonlySignal, signal } from '@preact/signals';

function createBoard() {
    const createRow = () => Array.from({ length: 9 }, () => 0);

    return Array.from({ length: 9 }, createRow);
}

const boardStore = signal(createBoard());
export const board = boardStore as ReadonlySignal<number[][]>;

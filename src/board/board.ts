import { ReadonlySignal, useSignal } from '@preact/signals';
import { BoardAction } from './action';
import { produce } from 'immer';

export const possibleCellValues = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export type CellValue = (typeof possibleCellValues)[number];

export function isPossibleCellValue(value: number): value is CellValue {
    return possibleCellValues.includes(value as CellValue);
}

type GivenCell = { type: 'given'; value: CellValue };
type FilledUserCell = { type: 'user'; value: CellValue };
type EmptyUserCell = { type: 'user'; value: null; notes: Set<CellValue> };

export type Cell = GivenCell | FilledUserCell | EmptyUserCell;

export type Board = Cell[];

export function useBoard(initialBoard: Board): {
    board: ReadonlySignal<Board>;
    performBoardAction: (action: BoardAction) => void;
} {
    const board = useSignal(initialBoard);

    function performBoardAction(action: BoardAction): void {
        board.value = produce(board.value, (newBoard) => {
            switch (action.type) {
                case 'undo': {
                    // todo
                    break;
                }
                case 'clear': {
                    const selectedCell = newBoard[action.selectedCellIndex];
                    if (selectedCell.type === 'given') {
                        console.warn('cannot clear given cell');
                        return board.value;
                    }

                    newBoard[action.selectedCellIndex] = {
                        type: 'user',
                        value: null,
                        notes: new Set(),
                    };
                    break;
                }
                case 'value': {
                    const selectedCell = newBoard[action.selectedCellIndex];
                    if (selectedCell.type === 'given') {
                        console.warn('cannot change value of given cell');
                        return board.value;
                    }

                    newBoard[action.selectedCellIndex].value = action.value;
                    break;
                }
                case 'note': {
                    const selectedCell = newBoard[action.selectedCellIndex];
                    if (selectedCell.type === 'given' || selectedCell.value != null) {
                        console.warn('cannot change notes of given or non-empty user cell');
                        return board.value;
                    }

                    if (selectedCell.notes.has(action.value)) {
                        selectedCell.notes.delete(action.value);
                    } else {
                        selectedCell.notes.add(action.value);
                    }
                    break;
                }
                default:
                    unreachable(action);
            }

            return newBoard;
        });
    }

    return { board, performBoardAction };
}

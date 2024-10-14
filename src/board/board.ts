import { ReadonlySignal, useSignal } from '@preact/signals';
import { BoardAction } from './action';
import { produce } from 'immer';
import { Difficulty, generateBoardAndSolution } from './generate';
import { useEffect } from 'preact/hooks';

export const possibleCellValues = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export type CellValue = (typeof possibleCellValues)[number];

export function isPossibleCellValue(value: number): value is CellValue {
    return possibleCellValues.includes(value as CellValue);
}

type GivenCell = { type: 'given'; value: CellValue };
type FilledUserCell = { type: 'user'; value: CellValue; error: boolean };
type EmptyUserCell = { type: 'user'; value: null; notes: Set<CellValue> };

export type Cell = GivenCell | FilledUserCell | EmptyUserCell;

export type Board = Cell[];

export function useBoard(difficulty: Difficulty): {
    board: ReadonlySignal<Board | null>;
    performBoardAction: (action: BoardAction) => void;
} {
    const board = useSignal<Board | null>(null);
    const solution = useSignal<Board | null>(null);

    useEffect(() => {
        generateBoardAndSolution(difficulty).then((boardAndSolution) => {
            board.value = boardAndSolution.board;
            solution.value = boardAndSolution.solution;
        });
    }, []);

    function performBoardAction(action: BoardAction): void {
        board.value = produce(board.value, (newBoard) => {
            if (newBoard == null) {
                console.warn('board not initialized');
                return newBoard;
            }

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

                    selectedCell.value = action.value;
                    (selectedCell as FilledUserCell).error =
                        solution.value?.[action.selectedCellIndex].value !== action.value;
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

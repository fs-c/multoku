import { ReadonlySignal, useSignal } from '@preact/signals';
import { produce } from 'immer';
import { useEffect } from 'preact/hooks';
import { BoardAction } from './action';
import { Board, FilledUserCell } from './board';
import { Difficulty, generateBoardAndSolution } from './generate';

export type InitialBoardCreationOptions = {
    difficulty: Difficulty;
};

export function useBoard(initialBoardCreationOptions: InitialBoardCreationOptions): {
    board: ReadonlySignal<Board | null>;
    performBoardAction: (action: BoardAction) => void;
    setBoard: (board: Board) => void;
} {
    const board = useSignal<Board | null>(null);
    const solution = useSignal<Board | null>(null);

    useEffect(() => {
        generateBoardAndSolution(initialBoardCreationOptions.difficulty).then(
            (boardAndSolution) => {
                board.value = boardAndSolution.board;
                solution.value = boardAndSolution.solution;
            },
        );
    }, []);

    function performBoardAction(action: BoardAction): void {
        board.value = produce(board.value, (newBoard) => {
            if (newBoard == null) {
                console.warn('board not initialized');
                return newBoard;
            }

            switch (action.type) {
                case 'undo': {
                    throw new Error('not implemented');
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

                    if (selectedCell.notes.includes(action.value)) {
                        selectedCell.notes = selectedCell.notes.filter(
                            (note) => note !== action.value,
                        );
                    } else {
                        selectedCell.notes.push(action.value);
                    }
                    break;
                }
                default:
                    unreachable(action);
            }

            return newBoard;
        });
    }

    function setBoard(newBoard: Board): void {
        board.value = newBoard;
    }

    return { board, performBoardAction, setBoard };
}

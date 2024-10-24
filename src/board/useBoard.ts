import { ReadonlySignal, useSignal } from '@preact/signals';
import { produce } from 'immer';
import { useEffect } from 'preact/hooks';
import { ConnectedBoardAction } from './action';
import { Board, FilledUserCell } from './board';
import { Difficulty, generateBoardAndSolution } from './generate';

export type InitialBoardCreationOptions = {
    difficulty: Difficulty;
};

export function useBoard(initialBoardCreationOptions: InitialBoardCreationOptions): {
    board: ReadonlySignal<Board | null>;
    solution: ReadonlySignal<Board | null>;
    performBoardAction: (action: ConnectedBoardAction) => void;
    setBoardAndSolution: (board: Board, solution: Board) => void;
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

    function performBoardAction(action: ConnectedBoardAction): void {
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
                        notes: [],
                    };
                    break;
                }
                case 'value': {
                    const selectedCell = newBoard[action.selectedCellIndex];
                    if (selectedCell.type === 'given') {
                        console.warn('cannot change value of given cell');
                        return board.value;
                    }

                    const newCell: FilledUserCell = {
                        ...selectedCell,
                        value: action.value,
                        error: solution.value?.[action.selectedCellIndex].value !== action.value,
                        user: action.user,
                    };

                    newBoard[action.selectedCellIndex] = newCell;
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

    function setBoardAndSolution(newBoard: Board, newSolution: Board): void {
        board.value = newBoard;
        solution.value = newSolution;
    }

    return { board, solution, performBoardAction, setBoardAndSolution };
}

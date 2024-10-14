import * as sudoku from 'sudoku-core';
import { Board, isPossibleCellValue } from './board';

export type { Difficulty } from 'sudoku-core';

function mapRawBoardToBoard(rawBoard: sudoku.Board): Board {
    return rawBoard.map((value) => {
        if (value != null && !isPossibleCellValue(value)) {
            throw new Error(`sudoku generator generated invalid cell value ${value}`);
        }

        return value == null ? { type: 'user', value, notes: new Set() } : { type: 'given', value };
    });
}

export function generateBoardAndSolution(difficulty: sudoku.Difficulty): Promise<{
    board: Board;
    solution: Board;
}> {
    return new Promise((resolve, reject) => {
        const rawBoard = sudoku.generate(difficulty);
        const rawSolution = sudoku.solve(rawBoard);
        if (
            rawSolution.board == null ||
            rawSolution.solved !== true ||
            rawSolution.analysis?.hasUniqueSolution !== true
        ) {
            return reject(new Error('sudoku generator generated invalid board'));
        }

        resolve({
            board: mapRawBoardToBoard(rawBoard),
            solution: mapRawBoardToBoard(rawSolution.board),
        });
    });
}

export function createEmptyBoard(): Board {
    return Array.from({ length: 81 }, () => ({ type: 'user', value: null, notes: new Set() }));
}

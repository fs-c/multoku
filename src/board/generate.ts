import * as sudoku from 'sudoku-core';
import { Board, isPossibleCellValue } from './board';

export function generateBoard(difficulty: sudoku.Difficulty): Board {
    return sudoku.generate(difficulty).map((value) => {
        if (value != null && !isPossibleCellValue(value)) {
            throw new Error(`sudoku generator generated invalid cell value ${value}`);
        }

        return value == null ? { type: 'user', value, notes: [] } : { type: 'given', value };
    });
}

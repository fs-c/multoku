import * as sudoku from 'sudoku-core';
import { Board } from '../store/board';

export function generateBoard(difficulty: sudoku.Difficulty): Board {
    return sudoku.generate(difficulty);
}

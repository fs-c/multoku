import { User } from './useConnectedBoard';

export const possibleCellValues = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export type CellValue = (typeof possibleCellValues)[number];

export function isPossibleCellValue(value: number): value is CellValue {
    return possibleCellValues.includes(value as CellValue);
}

export type GivenCell = { type: 'given'; value: CellValue };
export type FilledUserCell = { type: 'user'; value: CellValue; error: boolean; user: User };
export type EmptyUserCell = { type: 'user'; value: null; notes: CellValue[] };

export function isFilledUserCell(cell: Cell): cell is FilledUserCell {
    return cell.type === 'user' && cell.value != null;
}

export function isEmptyUserCell(cell: Cell): cell is EmptyUserCell {
    return cell.type === 'user' && cell.value == null;
}

export type Cell = GivenCell | FilledUserCell | EmptyUserCell;

export type Board = Cell[];

export const possibleCellValues = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export type CellValue = (typeof possibleCellValues)[number];

export function isPossibleCellValue(value: number): value is CellValue {
    return possibleCellValues.includes(value as CellValue);
}

type GivenCell = { type: 'given'; value: CellValue };
type UserCell = { type: 'user'; value: CellValue | null; notes: CellValue[] };

export type Cell = GivenCell | UserCell;

export type Board = Cell[];

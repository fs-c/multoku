import { CellValue } from './board';

export type GlobalAction = { type: 'undo' };

export type CellAction =
    | {
          type: 'value' | 'note';
          value: CellValue;
      }
    | {
          type: 'clear';
      };

export type BoardAction = (CellAction & { selectedCellIndex: number }) | GlobalAction;

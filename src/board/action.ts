import { CellValue } from './board';
import { User } from './useConnectedBoard';

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

export type ConnectedBoardAction = BoardAction & { user: User };

import './board.css';

import { useSignal } from '@preact/signals';
import { Controls } from './Controls';
import { CellAction, GlobalAction } from '../board/action';
import { useBoard } from '../board/board';
import { Square3Stack3DIcon } from '@heroicons/react/24/outline';
import { Board } from './Board';

export const minCellFontSize = 8;
export const maxCellFontSize = 128;

export function Game() {
    const { board, performBoardAction } = useBoard('medium');

    const cellFontSize = useSignal<number>(minCellFontSize);
    const selectedCellIndex = useSignal<number | null>(null);

    function onAction(action: CellAction | GlobalAction) {
        if (action.type === 'undo') {
            performBoardAction(action);
        } else {
            if (selectedCellIndex.value === null) {
                console.warn('no cell selected');
                return;
            }

            performBoardAction({ selectedCellIndex: selectedCellIndex.value, ...action });
        }
    }

    function setCellFontSize(fontSize: number) {
        cellFontSize.value = fontSize;
    }

    return board.value != null ? (
        <div className={'flex flex-col gap-8 w-full max-w-screen-md p-2 md:p-4'}>
            <Board
                board={board.value}
                selectedCellIndex={selectedCellIndex}
                setCellFontSize={setCellFontSize}
            />

            <Controls fontSize={cellFontSize} onAction={onAction} />
        </div>
    ) : (
        <div className={'flex justify-center items-center flex-grow'}>
            <Square3Stack3DIcon className={'size-12 text-orange-700 animate-bounce'} />
        </div>
    );
}

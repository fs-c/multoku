import './board.css';

import { useComputed, useSignal } from '@preact/signals';
import { Controls } from './Controls';
import { CellAction, GlobalAction } from '../board/action';
import { FireIcon } from '@heroicons/react/24/outline';
import { Board } from './Board';
import { useConnectedBoard } from '../board/useConnectedBoard';
import { useMemo } from 'preact/hooks';

export const minCellFontSize = 8;
export const maxCellFontSize = 128;

export function Game() {
    const initialToken = useMemo(
        () =>
            Math.floor(Math.random() * Math.pow(10, 5))
                .toString()
                .padStart(5, '0'),
        [],
    );

    const token = useSignal<string>(initialToken);
    const connectionOptions = useComputed(() => ({
        token: token.value,
        shouldHost: token.value === initialToken,
    }));

    const { board, performBoardAction } = useConnectedBoard(
        { difficulty: 'medium' },
        connectionOptions.value,
    );

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

            <form>
                <input
                    className={'bg-inherit'}
                    type={'text'}
                    value={token}
                    onInput={(event) => {
                        token.value = (event.target as HTMLInputElement).value;
                    }}
                />
            </form>
        </div>
    ) : (
        <div className={'flex justify-center items-center flex-grow'}>
            <FireIcon className={'size-12 text-orange-700 animate-bounce'} />
        </div>
    );
}

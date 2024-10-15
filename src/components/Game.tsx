import './board.css';

import { ReadonlySignal, useComputed, useSignal } from '@preact/signals';
import { Controls } from './Controls';
import { BoardAction, CellAction, GlobalAction } from '../board/action';
import { FireIcon } from '@heroicons/react/24/outline';
import { useRef } from 'preact/hooks';
import type { Board } from '../board/board';
import { useLargestFontSizeForChildSpan } from '../util/sizing';
import { Cell } from './Cell';
import { createEmptyBoard } from '../board/generate';
import { twMerge } from 'tailwind-merge';

export const minCellFontSize = 8;
export const maxCellFontSize = 128;

const emptyBoard = createEmptyBoard();

export function Game({
    board: actualBoard,
    performBoardAction,
}: {
    board: ReadonlySignal<Board | null>;
    performBoardAction: (action: BoardAction) => void;
}) {
    const referenceCellContainerRef = useRef<HTMLDivElement>(null);
    const cellFontSize = useLargestFontSizeForChildSpan(
        referenceCellContainerRef,
        minCellFontSize,
        maxCellFontSize,
    );

    const selectedCellIndex = useSignal<number | null>(null);

    const board = useComputed(() => actualBoard.value ?? emptyBoard);

    const isLoaded = useComputed(() => actualBoard.value != null && cellFontSize.value != null);

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

    function onCellSelected(cellIndex: number) {
        if (selectedCellIndex.value === cellIndex) {
            selectedCellIndex.value = null;
        } else {
            selectedCellIndex.value = cellIndex;
        }
    }

    return (
        <div className={'relative flex-grow w-full'}>
            <div
                className={twMerge(
                    'flex flex-col gap-8 w-full max-w-screen-md p-2 md:p-4 transition',
                    isLoaded.value ? 'opacity-100' : 'opacity-0',
                )}
            >
                <div className={'board grid grid-cols-9 select-none relative'}>
                    <div ref={referenceCellContainerRef}>
                        <Cell
                            cell={board.value[0]}
                            fontSize={cellFontSize.value ?? minCellFontSize}
                            selected={selectedCellIndex.value === 0}
                            onSelected={() => onCellSelected(0)}
                        />
                    </div>

                    {board.value.map((cell, cellIndex) =>
                        cellIndex === 0 ? (
                            <></>
                        ) : (
                            <Cell
                                key={cellIndex}
                                cell={cell}
                                fontSize={cellFontSize.value ?? minCellFontSize}
                                selected={selectedCellIndex.value === cellIndex}
                                onSelected={() => onCellSelected(cellIndex)}
                            />
                        ),
                    )}
                </div>

                <Controls fontSize={cellFontSize} onAction={onAction} />
            </div>
            <div
                className={twMerge(
                    'flex justify-center items-center flex-grow absolute left-1/2 top-1/2 -translate-x-1/2 opacity-100 transition',
                    isLoaded.value && 'opacity-0',
                )}
            >
                <FireIcon className={'size-12 text-orange-700 animate-bounce'} />
            </div>
        </div>
    );
}

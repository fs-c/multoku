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
        <div className={'relative w-full flex-grow'}>
            <div
                className={twMerge(
                    'mx-auto flex w-full max-w-screen-md flex-col gap-8 p-2 transition md:p-4',
                    isLoaded.value ? 'opacity-100' : 'opacity-0',
                )}
            >
                <div className={'board grid select-none grid-cols-9 grid-rows-9'}>
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
                    'absolute left-1/2 top-1/2 flex flex-grow -translate-x-1/2 items-center justify-center opacity-100 transition',
                    isLoaded.value && '-z-10 opacity-0',
                )}
            >
                <FireIcon className={'size-12 animate-bounce text-orange-700'} />
            </div>
        </div>
    );
}

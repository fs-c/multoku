import './board.css';

import { useMemo, useRef } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { useLargestFontSizeForChildSpan } from '../util/sizing';
import { Cell } from './Cell';
import { Controls } from './Controls';
import { generateBoard } from '../board/generate';
import { CellAction, GlobalAction } from '../board/action';
import { useBoard } from '../board/board';

export function Board() {
    const initialBoard = useMemo(() => generateBoard('medium'), []);
    const { board, performBoardAction } = useBoard(initialBoard);

    const referenceCellContainerRef = useRef<HTMLDivElement>(null);
    const cellFontSize = useLargestFontSizeForChildSpan(referenceCellContainerRef, 8, 128);

    const selectedCellIndex = useSignal<number | null>(null);

    function onCellSelected(cellIndex: number) {
        if (selectedCellIndex.value === cellIndex) {
            selectedCellIndex.value = null;
        } else {
            selectedCellIndex.value = cellIndex;
        }
    }

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

    return (
        <div className={'flex flex-col gap-8 w-full max-w-screen-md p-2 md:p-4'}>
            <div className={'board grid grid-cols-9 select-none'}>
                <div ref={referenceCellContainerRef}>
                    <Cell
                        cell={board.value[0]}
                        fontSize={cellFontSize}
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
                            fontSize={cellFontSize}
                            selected={selectedCellIndex.value === cellIndex}
                            onSelected={() => onCellSelected(cellIndex)}
                        />
                    ),
                )}
            </div>

            <Controls fontSize={cellFontSize} onAction={onAction} />
        </div>
    );
}

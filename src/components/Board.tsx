import './board.css';

import { useRef } from 'preact/hooks';
import { computed, signal, useComputed, useSignal } from '@preact/signals';
import { useLargestFontSizeForChildSpan } from '../util/sizing';
import { Cell } from './Cell';
import { Controls } from './Controls';
import { generateBoard } from '../board/generate';
import { CellAction, GlobalAction } from '../board/action';
import { useBoard } from '../board/board';

export function Board() {
    const { board, performBoardAction } = useBoard(generateBoard('medium'));

    const referenceCellContainerRef = useRef<HTMLDivElement>(null);
    const cellFontSize = useLargestFontSizeForChildSpan(referenceCellContainerRef, 8, 128);

    const selectedCellIndex = useSignal<number | null>(null);

    // this is an optimization, otherwise the entire board would re-render on every cell selection
    // which would make selection have a noticeable delay
    const cellIsSelectedByIndexSignal = useComputed(() => {
        return board.value.map((_, index) => computed(() => index === selectedCellIndex.value));
    });

    const boardValueByIndexSignal = useComputed(() => {
        return board.value.map((cell) => computed(() => cell));
    });

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
                        cell={boardValueByIndexSignal.value[0]}
                        fontSize={cellFontSize}
                        selected={cellIsSelectedByIndexSignal.value[0]}
                        onSelected={() => onCellSelected(0)}
                    />
                </div>

                {boardValueByIndexSignal.value.map((signal, cellIndex) =>
                    cellIndex === 0 ? (
                        <></>
                    ) : (
                        <Cell
                            key={cellIndex}
                            cell={signal}
                            fontSize={cellFontSize}
                            selected={cellIsSelectedByIndexSignal.value[cellIndex]}
                            onSelected={() => onCellSelected(cellIndex)}
                        />
                    ),
                )}
            </div>

            <Controls fontSize={cellFontSize} onAction={onAction} />
        </div>
    );
}

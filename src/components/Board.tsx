import './board.css';

import { useRef } from 'preact/hooks';
import { computed, useComputed, useSignal } from '@preact/signals';
import { useLargestFontSizeForChildSpan } from '../util/sizing';
import { Cell } from './Cell';
import { Controls, ControlsAction } from './Controls';
import { generateBoard } from '../board/generate';

export function Board() {
    const board = useSignal(generateBoard('easy'));

    const referenceCellContainerRef = useRef<HTMLDivElement>(null);
    const cellFontSize = useLargestFontSizeForChildSpan(referenceCellContainerRef, 8, 128);

    const selectedCellIndex = useSignal<number | null>(null);

    // this is an optimization, otherwise the entire board would re-render on every cell selection
    // which would make selection have a noticeable delay
    const cellIsSelectedByIndexSignal = useComputed(() => {
        return board.value.map((_, index) => computed(() => index === selectedCellIndex.value));
    });

    function onCellSelected(cellIndex: number) {
        if (selectedCellIndex.value === cellIndex) {
            selectedCellIndex.value = null;
        } else {
            selectedCellIndex.value = cellIndex;
        }
    }

    function onControlsAction(action: ControlsAction) {
        switch (action.type) {
            case 'undo':
                break;
            case 'value':
                break;
            case 'note':
                if (selectedCellIndex.value == null) {
                    console.warn('note action without selected cell');
                    return;
                }

                const selectedCell = board.value[selectedCellIndex.value ?? 0];
                if (selectedCell.type === 'given') {
                    console.warn('note action on given cell');
                    return;
                }

                const updatedCell = {
                    ...selectedCell,
                    notes: selectedCell.notes.includes(action.value)
                        ? selectedCell.notes.filter((note) => note !== action.value)
                        : [...selectedCell.notes, action.value],
                };

                const boardCopy = [...board.value];
                boardCopy[selectedCellIndex.value] = updatedCell;
                board.value = boardCopy;

                break;
            case 'clear':
                break;
        }
    }

    return (
        <div className={'flex flex-col gap-8 w-full max-w-screen-md p-2 md:p-4'}>
            <div className={'board grid grid-cols-9 select-none'}>
                <div ref={referenceCellContainerRef}>
                    <Cell
                        cell={board.value[0]}
                        fontSize={cellFontSize}
                        selected={cellIsSelectedByIndexSignal.value[0]}
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
                            selected={cellIsSelectedByIndexSignal.value[cellIndex]}
                            onSelected={() => onCellSelected(cellIndex)}
                        />
                    ),
                )}
            </div>

            <Controls fontSize={cellFontSize} onAction={onControlsAction} />
        </div>
    );
}

import { Signal, useSignalEffect } from '@preact/signals';
import type { Board } from '../board/board';
import { useRef } from 'preact/hooks';
import { useLargestFontSizeForChildSpan } from '../util/sizing';
import { Cell } from './Cell';
import { minCellFontSize, maxCellFontSize } from './Game';

export function Board({
    board,
    selectedCellIndex,
    setCellFontSize,
}: {
    board: Board;
    selectedCellIndex: Signal<number | null>;
    setCellFontSize: (fontSize: number) => void;
}) {
    const referenceCellContainerRef = useRef<HTMLDivElement>(null);
    const cellFontSize = useLargestFontSizeForChildSpan(
        referenceCellContainerRef,
        minCellFontSize,
        maxCellFontSize,
    );

    useSignalEffect(() => {
        setCellFontSize(cellFontSize.value);
    });

    function onCellSelected(cellIndex: number) {
        if (selectedCellIndex.value === cellIndex) {
            selectedCellIndex.value = null;
        } else {
            selectedCellIndex.value = cellIndex;
        }
    }

    return (
        <div className={'board grid grid-cols-9 select-none relative'}>
            <div ref={referenceCellContainerRef}>
                <Cell
                    cell={board[0]}
                    fontSize={cellFontSize}
                    selected={selectedCellIndex.value === 0}
                    onSelected={() => onCellSelected(0)}
                />
            </div>

            {board.map((cell, cellIndex) =>
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
    );
}

import './board.css';

import { board } from '../store/board';
import { useRef } from 'preact/hooks';
import { Signal } from '@preact/signals';
import { useLargestFontSizeForChildSpan } from '../util/sizing';

function Cell({ value, fontSize }: { value: number | null; fontSize: Signal<number> }) {
    return (
        <div className={'aspect-square flex justify-center items-center text-gray-700 relative'}>
            <span
                className={'absolute left-1/2 -translate-x-1/2'}
                style={{ fontSize: `${fontSize.value}px` }}
            >
                {value ?? ''}
            </span>
        </div>
    );
}

export function Board() {
    const referenceCellContainerRef = useRef<HTMLDivElement>(null);
    const cellFontSize = useLargestFontSizeForChildSpan(referenceCellContainerRef, 8, 128);

    return (
        <div className={'grid grid-cols-9 board w-full max-w-screen-md p-4 relative'}>
            <div ref={referenceCellContainerRef}>
                <Cell value={board.value[0]} fontSize={cellFontSize} />
            </div>

            {board.value.slice(1).map((cell, cellIndex) => (
                <Cell key={cellIndex} value={cell} fontSize={cellFontSize} />
            ))}
        </div>
    );
}

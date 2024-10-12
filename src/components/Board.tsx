import { useComputed } from '@preact/signals';
import { board } from '../store/board';

export function Board() {
    const boardGroups = useComputed(() => board.value.map((row, rowIndex) => );

    return (
        <div className={'grid grid-cols-9'}>
            {flatBoard.value.map((cell, cellIndex) => (
                <div
                    key={cellIndex}
                    className={'w-8 h-8 flex justify-center items-center'}
                >
                    {cell}
                </div>
            ))}
        </div>
    );
}

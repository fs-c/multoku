import './board.css';

import { board } from '../store/board';

export function Board() {
    return (
        <div className={'grid grid-cols-9 board'}>
            {board.value.map((cell, cellIndex) => (
                <div
                    key={cellIndex}
                    className={
                        'w-16 h-16 flex justify-center items-center text-gray-400'
                    }
                >
                    {cell ?? ''}
                </div>
            ))}
        </div>
    );
}

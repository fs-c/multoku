import { ReadonlySignal, useComputed } from '@preact/signals';
import { ComponentChildren } from 'preact';
import { twMerge } from 'tailwind-merge';
import { possibleCellValues } from '../board/board';
import type * as Board from '../board/board';

export function BaseCell({
    children,
    className = '',
    onClick = () => {},
}: {
    children: ComponentChildren;
    className?: string;
    onClick?: () => void;
}) {
    return (
        <div
            className={twMerge(
                'aspect-square flex justify-center items-center text-black/75 relative',
                className,
            )}
            onClick={onClick}
        >
            {children}
        </div>
    );
}

export function Cell({
    cell,
    fontSize,
    className,
    selected,
    onSelected,
}: {
    cell: Board.Cell;
    fontSize: ReadonlySignal<number>;
    className?: string;
    selected: boolean;
    onSelected?: () => void;
}) {
    const notes = cell.type === 'given' || cell.value != null ? null : cell.notes;

    return (
        <BaseCell
            className={twMerge(
                selected ? 'bg-black/5' : 'bg-white/25',
                'grid grid-cols-3 grid-rows-3',
                className,
            )}
            onClick={onSelected}
        >
            <span
                className={twMerge(
                    'absolute left-1/2 -translate-x-1/2',
                    cell.type === 'user' && 'text-orange-700',
                )}
                style={{ fontSize: `${fontSize.value}px` }}
            >
                {cell.value ?? ''}
            </span>

            {notes != null &&
                possibleCellValues.map((noteValue) => (
                    <span
                        key={noteValue}
                        className={'text-black/50 text-center'}
                        style={{ fontSize: `${fontSize.value / 3}px` }}
                    >
                        {notes.has(noteValue) ? noteValue : ''}
                    </span>
                ))}
        </BaseCell>
    );
}

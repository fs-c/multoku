import { ComponentChildren } from 'preact';
import { twMerge } from 'tailwind-merge';
import { possibleCellValues } from '../board/board';
import type { Cell } from '../board/board';
import { isFilledUserCell } from '../board/board';

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
    cell: Cell;
    fontSize: number;
    className?: string;
    selected: boolean;
    onSelected?: () => void;
}) {
    const notes = cell.type === 'given' || cell.value != null ? null : cell.notes;

    const hasError = isFilledUserCell(cell) && cell.error;

    return (
        <BaseCell
            className={twMerge(
                selected
                    ? hasError
                        ? 'bg-red-500/30'
                        : 'bg-black/5'
                    : hasError
                      ? 'bg-red-500/15'
                      : 'bg-white/25',
                'grid grid-cols-3 grid-rows-3',
                className,
            )}
            onClick={onSelected}
        >
            <span
                className={twMerge(
                    'absolute left-1/2 -translate-x-1/2',
                    cell.type === 'user' && (hasError ? 'text-red-700' : 'text-orange-700'),
                )}
                style={{ fontSize: `${fontSize}px` }}
            >
                {cell.value}
            </span>

            {notes != null &&
                notes.length > 0 &&
                possibleCellValues.map((noteValue) => (
                    <span
                        key={noteValue}
                        className={'text-black/50 text-center'}
                        style={{ fontSize: `${fontSize / 3}px` }}
                    >
                        {notes.includes(noteValue) ? noteValue : ''}
                    </span>
                ))}
        </BaseCell>
    );
}

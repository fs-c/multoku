import { twMerge } from 'tailwind-merge';
import { possibleCellValues } from '../board/board';
import type { Cell } from '../board/board';
import { isFilledUserCell } from '../board/board';

export function Cell({
    cell,
    fontSize,
    selected,
    onSelected,
}: {
    cell: Cell;
    fontSize: number;
    selected: boolean;
    onSelected: () => void;
}) {
    const notes = cell.type === 'given' || cell.value != null ? null : cell.notes;

    const hasError = isFilledUserCell(cell) && cell.error;

    function internalOnSelected() {
        // don't allow selecting (1) non-user cells and (2) user cells which were filled correctly
        if (cell.type !== 'user' || (cell.value != null && !cell.error)) {
            return;
        }

        onSelected();
    }

    return (
        <button
            className={twMerge(
                'relative flex aspect-square w-full items-center justify-center text-black/75',
                selected
                    ? hasError
                        ? 'bg-red-500/30'
                        : 'bg-black/5'
                    : hasError
                      ? 'bg-red-500/15'
                      : 'bg-white/25',
                'grid grid-cols-3 grid-rows-3',
            )}
            onClick={internalOnSelected}
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
                        className={'text-center text-black/50'}
                        style={{ fontSize: `${fontSize / 3}px` }}
                    >
                        {notes.includes(noteValue) ? noteValue : ''}
                    </span>
                ))}
        </button>
    );
}

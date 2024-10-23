import { twMerge } from 'tailwind-merge';
import { possibleCellValues } from '../board/board';
import type { Cell } from '../board/board';
import { isFilledUserCell } from '../board/board';
import { UserColor } from '../board/useConnectedBoard';

// it's important to have the full class names here, otherwise tailwind will not generate them
function userColorToTailwindClass(color: UserColor): string {
    switch (color) {
        case 'orange':
            return 'text-orange-700';
        case 'purple':
            return 'text-purple-700';
        case 'sky':
            return 'text-sky-700';
        case 'lime':
            return 'text-lime-700';
        default:
            unreachable(color);
    }
}

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
                        ? 'bg-red-500/40'
                        : 'bg-black/5'
                    : hasError
                      ? 'bg-red-500/30'
                      : 'bg-white/25',
                'grid grid-cols-3 grid-rows-3',
            )}
            onClick={internalOnSelected}
        >
            <span
                className={twMerge(
                    'absolute left-1/2 -translate-x-1/2',
                    isFilledUserCell(cell) && userColorToTailwindClass(cell.user.color),
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

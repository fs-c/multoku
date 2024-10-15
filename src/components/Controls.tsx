import {
    ArrowUturnLeftIcon,
    BackspaceIcon,
    BeakerIcon,
    PencilIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { ReadonlySignal, useSignal } from '@preact/signals';
import { ComponentType } from 'preact';
import { twMerge } from 'tailwind-merge';
import { BaseCell, Cell } from './Cell';
import { possibleCellValues } from '../board/board';
import { CellAction, GlobalAction } from '../board/action';
import { useMemo } from 'preact/hooks';

function MobileAction({
    Icon,
    label,
    onClick,
    className,
}: {
    Icon: ComponentType<any>; // todo: better type, don't want to think about it rn
    label: string;
    onClick: () => void;
    className?: string;
}) {
    return (
        <button
            className={twMerge(
                'flex flex-col gap-1 justify-center items-center p-3 rounded-md text-black/75',
                className,
            )}
            onClick={onClick}
        >
            <Icon className={'size-8'} />

            <span>{label}</span>
        </button>
    );
}

export function Controls({
    fontSize,
    onAction,
}: {
    fontSize: ReadonlySignal<number | null>;
    onAction: (action: CellAction | GlobalAction) => void;
}) {
    const mode = useSignal<'value' | 'note'>('value');

    const dummyCells = useMemo(
        () => possibleCellValues.map((value) => ({ type: 'given' as const, value })),
        [possibleCellValues],
    );

    // todo: desktop controls are super WIP/non-functional
    //  also i would like to have there be a Mobile/DesktopControls component since they are so different
    //  maybe conditionally render them since right now both are in the DOM (but one is hidden)
    return (
        <>
            <div className={'grid-cols-9 relative hidden md:grid'}>
                <button
                    className={
                        'absolute left-0 h-full -translate-x-full border-2 border-r border-black/50 rounded-l-md border-r-black/20'
                    }
                    onClick={() => (mode.value = mode.value === 'note' ? 'value' : 'note')}
                >
                    <BaseCell className={'h-full'}>
                        {mode.value === 'note' ? (
                            <PencilIcon className={'size-10'} />
                        ) : (
                            <BeakerIcon className={'size-10'} />
                        )}
                    </BaseCell>
                </button>

                {dummyCells.map((cell) => (
                    <button key={cell.value} className={'border-t-2 border-b-2 border-black/50'}>
                        <Cell
                            cell={cell}
                            fontSize={fontSize}
                            /* there is some completely absurd issue where adding border-l/r to the parent button 
                               changes the height (???) and adding it here is my workaround (╯°□°）╯︵ ┻━┻ */
                            className={'border-r border-black/20'}
                            selected={false}
                        />
                    </button>
                ))}

                <button
                    className={
                        'absolute right-0 h-full translate-x-full border-t-2 border-b-2 border-r-2 border-black/50 rounded-r-md'
                    }
                >
                    <BaseCell className={'h-full'}>
                        <XMarkIcon className={'size-12'} />
                    </BaseCell>
                </button>
            </div>

            <div className={'flex flex-col md:hidden gap-4'}>
                <div className={'grid grid-cols-9 text-orange-700'}>
                    {possibleCellValues.map((value) => (
                        <button
                            style={{ fontSize: `${fontSize.value}px` }}
                            onClick={() => onAction({ type: mode.value, value })}
                        >
                            {value}
                        </button>
                    ))}
                </div>

                <div className={'flex flex-row gap-8 justify-center text-sm'}>
                    <MobileAction
                        Icon={ArrowUturnLeftIcon}
                        label={'Undo'}
                        onClick={() => onAction({ type: 'undo' })}
                    />

                    <MobileAction
                        Icon={BeakerIcon}
                        label={'Note'}
                        onClick={() =>
                            mode.value === 'value' ? (mode.value = 'note') : (mode.value = 'value')
                        }
                        className={mode.value === 'note' ? 'text-black bg-orange-300/25' : ''}
                    />

                    <MobileAction
                        Icon={BackspaceIcon}
                        label={'Clear'}
                        onClick={() => onAction({ type: 'clear' })}
                    />
                </div>
            </div>
        </>
    );
}

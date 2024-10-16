import { ArrowUturnLeftIcon, BackspaceIcon, BeakerIcon } from '@heroicons/react/24/outline';
import { ReadonlySignal, useSignal } from '@preact/signals';
import { ComponentType } from 'preact';
import { twJoin, twMerge } from 'tailwind-merge';
import { possibleCellValues } from '../board/board';
import { CellAction, GlobalAction } from '../board/action';

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
                'flex flex-col items-center justify-center gap-1 rounded-md p-3 text-black/75',
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

    return (
        <>
            <div className={'flex flex-col gap-4'}>
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

                <div className={'flex flex-row justify-center gap-8 text-sm'}>
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
                        className={mode.value === 'note' ? 'bg-orange-300/25 text-black' : ''}
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

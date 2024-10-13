import './board.css';

import { board } from '../store/board';
import { useRef } from 'preact/hooks';
import { ReadonlySignal, Signal, useSignal } from '@preact/signals';
import { useLargestFontSizeForChildSpan } from '../util/sizing';
import { ComponentChildren } from 'preact';
import { XMarkIcon } from './icons/XMarkIcon';
import { twMerge } from 'tailwind-merge';
import { PencilIcon } from './icons/PencilIcon';
import { BeakerIcon } from './icons/BeakerIcon';

function BaseCell({ children, className }: { children: ComponentChildren; className?: string }) {
    return (
        <div
            className={twMerge(
                'aspect-square flex justify-center items-center text-gray-700 relative',
                className,
            )}
        >
            {children}
        </div>
    );
}

function Cell({
    value,
    fontSize,
    className,
}: {
    value: number | null;
    fontSize: ReadonlySignal<number>;
    className?: string;
}) {
    return (
        <BaseCell className={twMerge('bg-white/25', className)}>
            <span
                className={'absolute left-1/2 -translate-x-1/2'}
                style={{ fontSize: `${fontSize.value}px` }}
            >
                {value ?? ''}
            </span>
        </BaseCell>
    );
}

function Controls({
    fontSize,
    mode,
}: {
    fontSize: ReadonlySignal<number>;
    mode: Signal<'edit' | 'note'>;
}) {
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    return (
        <>
            <div className={'grid-cols-9 relative hidden md:grid'}>
                <button
                    className={
                        'absolute left-0 h-full -translate-x-full border-2 border-r border-black/50 rounded-l-md border-r-black/20'
                    }
                    onClick={() => (mode.value = mode.value === 'note' ? 'edit' : 'note')}
                >
                    <BaseCell className={'h-full'}>
                        {mode.value === 'note' ? (
                            <PencilIcon className={'size-10'} />
                        ) : (
                            <BeakerIcon className={'size-10'} />
                        )}
                    </BaseCell>
                </button>

                {values.map((value) => (
                    <button key={value} className={'border-t-2 border-b-2 border-black/50'}>
                        <Cell
                            value={value}
                            fontSize={fontSize}
                            /* there is some completely absurd issue where adding border-l/r to the parent button 
                               changes the height (???) and adding it here is my workaround (╯°□°）╯︵ ┻━┻ */
                            className={'border-r border-black/20'}
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

            <div className={'flex flex-col md:hidden gap-1'}>
                <div className={'grid grid-cols-9 text-orange-700'}>
                    {values.map((value) => (
                        <button style={{ fontSize: `${fontSize.value}px` }}>{value}</button>
                    ))}
                </div>
            </div>
        </>
    );
}

export function Board() {
    const referenceCellContainerRef = useRef<HTMLDivElement>(null);
    const cellFontSize = useLargestFontSizeForChildSpan(referenceCellContainerRef, 8, 128);

    const mode = useSignal<'edit' | 'note'>('edit');

    return (
        <div className={'flex flex-col gap-8 w-full max-w-screen-md p-2 md:p-4'}>
            <div className={'grid grid-cols-9 board'}>
                <div ref={referenceCellContainerRef}>
                    <Cell value={board.value[0]} fontSize={cellFontSize} />
                </div>

                {board.value.slice(1).map((cell, cellIndex) => (
                    <Cell key={cellIndex} value={cell} fontSize={cellFontSize} />
                ))}
            </div>

            <Controls fontSize={cellFontSize} mode={mode} />
        </div>
    );
}

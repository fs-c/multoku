import { Signal } from '@preact/signals';

export function ConnectivityBar({ token }: { token: Signal<string> }) {
    return (
        <div className={'flex w-full flex-row p-2'}>
            <p>
                <span className={'mr-2 text-black/75'}>Connection Token</span>
                <span className={'font-mono tracking-widest text-orange-700'}>{token}</span>
            </p>
        </div>
    );
}

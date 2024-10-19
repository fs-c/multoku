import { Square3Stack3DIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Signal, useSignal } from '@preact/signals';
import { useRef } from 'preact/hooks';

export function Header({ token }: { token: Signal<string> }) {
    const connectionDialogRef = useRef<HTMLDialogElement>(null);

    const newToken = useSignal('');

    function openConnectionDialog() {
        connectionDialogRef.current?.showModal();
    }

    function closeConnectionDialog(e: Event) {
        e.preventDefault();

        connectionDialogRef.current?.close();
    }

    function onConnect(e: Event) {
        closeConnectionDialog(e);

        token.value = newToken.value;
    }

    return (
        <>
            <div
                className={
                    'flex w-full max-w-screen-md flex-row items-center justify-between gap-4 p-4 font-mono'
                }
            >
                <div className={'flex flex-row gap-2'}>
                    <Square3Stack3DIcon className={'size-6 text-orange-700'} />

                    <p>
                        <span className={'underline decoration-orange-600'}>mult</span>
                        <span>oku</span>
                    </p>
                </div>

                <button
                    className={
                        'flex flex-row items-center gap-2 rounded-md bg-orange-300 px-3 py-1 text-orange-900'
                    }
                    onClick={openConnectionDialog}
                >
                    <p>{token}</p>

                    <UserGroupIcon className={'size-5'} />
                </button>
            </div>

            <dialog
                ref={connectionDialogRef}
                className={
                    'absolute left-0 top-16 m-0 mx-auto w-full max-w-screen-sm bg-transparent p-4 backdrop:backdrop-blur-sm'
                }
            >
                <form className={'flex flex-col gap-2 rounded-lg bg-orange-100 p-4 text-black/75'}>
                    <p>
                        <span className={'font-semibold text-orange-800'}>
                            Share the session code
                        </span>{' '}
                        below with others, or{' '}
                        <span className={'font-semibold text-orange-800'}>enter a new one</span> to
                        join a different session
                    </p>

                    <label className={'block'}>
                        <input
                            className={
                                'mt-1 w-full rounded-md border border-black/50 bg-orange-100 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-300'
                            }
                            value={token}
                            onInput={(e) => (newToken.value = e.currentTarget.value)}
                        />
                    </label>

                    <button
                        autofocus
                        className={
                            'w-full self-center rounded-md border-0 bg-orange-300 px-3 py-1 text-orange-900'
                        }
                        onClick={onConnect}
                    >
                        Connect
                    </button>

                    <button
                        className={
                            'w-full self-center rounded-md bg-orange-200 px-3 py-1 text-orange-900'
                        }
                        onClick={closeConnectionDialog}
                    >
                        Close
                    </button>
                </form>
            </dialog>
        </>
    );
}

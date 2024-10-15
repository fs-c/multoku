import './index.css';

import { Game } from './components/Game';
import { render } from 'preact';
import { Header } from './components/Header';
import { useConnectedBoard } from './board/useConnectedBoard';
import { useSignal, useComputed } from '@preact/signals';
import { useMemo } from 'preact/hooks';
import { ConnectivityBar } from './components/ConnectivityBar';

export function App() {
    const initialToken = useMemo(
        () =>
            Math.floor(Math.random() * Math.pow(10, 5))
                .toString()
                .padStart(5, '0'),
        [],
    );

    const token = useSignal<string>(initialToken);
    const connectionOptions = useComputed(() => ({
        token: token.value,
        shouldHost: token.value === initialToken,
    }));

    const { board, performBoardAction } = useConnectedBoard(
        { difficulty: 'medium' },
        connectionOptions.value,
    );

    return (
        <div className={'relative flex h-full min-h-screen flex-col items-center'}>
            <Header token={token} />

            <Game board={board} performBoardAction={performBoardAction} />
        </div>
    );
}

const container = document.getElementById('app');
if (container == null) {
    throw new Error('no app container found');
}

render(<App />, container);

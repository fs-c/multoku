import './index.css';

import { Board } from './components/Board';
import { render } from 'preact';
import { Header } from './components/Header';
import { enableMapSet } from 'immer';

export function App() {
    return (
        <div className={'min-h-screen flex flex-col items-center'}>
            <Header />

            <Board />
        </div>
    );
}

enableMapSet();

const container = document.getElementById('app');
if (container == null) {
    throw new Error('no app container found');
}

render(<App />, container);

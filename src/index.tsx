import './index.css';

import { Game } from './components/Game';
import { render } from 'preact';
import { Header } from './components/Header';

export function App() {
    return (
        <div className={'min-h-screen h-full flex flex-col items-center'}>
            <Header />

            <Game />
        </div>
    );
}

const container = document.getElementById('app');
if (container == null) {
    throw new Error('no app container found');
}

render(<App />, container);

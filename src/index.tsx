import './index.css';

import { useEffect } from 'preact/hooks';
import { Board } from './components/Board';
import { render } from 'preact';
import { generateBoard } from './data/generateBoard';
import { board } from './store/board';

export function App() {
    useEffect(() => {
        board.value = generateBoard('easy');
    }, []);

    return (
        <div className={'min-h-screen flex justify-center items-center'}>
            <Board />
        </div>
    );
}

const container = document.getElementById('app');
if (container == null) {
    throw new Error('no app container found');
}

render(<App />, container);
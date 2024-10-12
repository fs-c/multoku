import { Board } from './components/Board';
import './index.css';

import { render } from 'preact';

export function App() {
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

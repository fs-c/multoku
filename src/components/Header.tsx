import { Square3Stack3dIcon } from './icons/Square3Stack3dIcon';

export function Header() {
    return (
        <div className={'max-w-screen-md p-4 flex flex-row justify-between gap-4 font-mono w-full'}>
            <div className={'flex flex-row gap-2'}>
                <Square3Stack3dIcon />

                <p>
                    <span className={'underline'}>mult</span>
                    <span>oku</span>
                </p>
            </div>

            <a href={'https://github.com/fs-c/multoku'} className={'underline'}>
                github
            </a>
        </div>
    );
}

import { Square3Stack3DIcon } from '@heroicons/react/24/outline';
import { ArrowUturnLeftIcon, Bars3Icon } from '@heroicons/react/24/solid';

export function Header() {
    return (
        <div
            className={
                'max-w-screen-md p-4 flex flex-row justify-between gap-4 font-mono w-full decoration-orange-600'
            }
        >
            <div className={'flex flex-row gap-2'}>
                <Square3Stack3DIcon className={'size-6 text-orange-700'} />

                <p>
                    <span className={'underline decoration-orange-600'}>mult</span>
                    <span>oku</span>
                </p>
            </div>

            <div className={'hidden md:flex flex-row'}>
                <a href={'https://github.com/fs-c/multoku'} className={'underline'}>
                    github
                </a>
            </div>

            <div className={'flex flex-row md:hidden gap-4'}>
                <ArrowUturnLeftIcon className={'size-6 text-black/20'} />

                <Bars3Icon className={'size-6'} />
            </div>
        </div>
    );
}

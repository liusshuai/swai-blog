'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowIcon } from '@swai/icon';
import './AppNavs.scss';

export default function AppNavs() {
    const pathname = usePathname();

    function getLinkClasses(routePath: string) {
        const classes: string[] = [
            'px-5',
            'text-primary dark:text-primary-dark tablet:text-white',
            'h-full',
            'leading-[var(--nav-height)]',
            'hover:opacity-100',
        ];

        if (routePath === pathname) {
            classes.push('is-active font-semibold');
        }

        return classes.join(' ');
    }

    return (
        <nav className="app-navs flex flex-col items-center tablet:mx-10 tablet:h-nav tablet:flex-row">
            <Link className={getLinkClasses('/')} href={'/'}>
                首页
                <ArrowIcon className="tablet:hidden" size={18} />
            </Link>
            <Link className={getLinkClasses('/filing')} href={'/filing'}>
                归档
                <ArrowIcon className="tablet:hidden" size={18} />
            </Link>
            <Link className={getLinkClasses('/board')} href={'/board'}>
                留言板
                <ArrowIcon className="tablet:hidden" size={18} />
            </Link>
            <a className={getLinkClasses('/about')} target="_blank" href={'https://www.yuque.com/lsshuai'}>
                关于
                <ArrowIcon className="tablet:hidden" size={18} />
            </a>
        </nav>
    );
}

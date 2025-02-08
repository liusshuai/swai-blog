import React from 'react';
import type { Metadata } from 'next';
import AppHeader from '@/components/layout/AppHeader';
import AppFooter from '@/components/layout/AppFooter';
import './style.css';

export const metadata: Metadata = {
    title: 'LSSHUAISL的个人博客',
    description: 'LSSHUAISL的个人博客',
    referrer: 'no-referrer',
    authors: { name: 'lsshuai' },
    keywords: ['个人博客'],
    icons: [
        {
            rel: 'shortcut icon',
            url: '/image/favicon.jpeg',
        },
    ],
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="mobile:min-w-full min-w-layout h-full overflow-hidden overflow-x-auto">
            <body className="h-full bg-page overflow-y-auto dark:bg-page-dark">
                <AppHeader />
                <main className="my-5 tablet:my-10">{children}</main>
                <AppFooter />
            </body>
        </html>
    );
}

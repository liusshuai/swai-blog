'use client';

import { Card, Typography } from '@swai/ui';
import { useRef } from 'react';
import UserData from './UserData';

interface UserCardProps {
    hideOutLinks?: boolean;
}

export default function UserCard(props: UserCardProps) {
    const { hideOutLinks } = props;

    const outLinks = useRef([
        {
            icon: '/image/yuque.svg',
            title: '语雀',
            url: 'https://www.yuque.com/lsshuai',
        },
        {
            icon: '/image/github.svg',
            title: 'Github',
            url: 'https://github.com/liusshuai',
        },
    ]);

    return (
        <Card className="w-80 sticky top-[calc(var(--nav-height)+20px)]" shadow="hover">
            <UserData />
            {hideOutLinks ? null : (
                <div className="py-3">
                    {outLinks.current.map((link) => (
                        <a
                            key={link.title}
                            className="flex items-center gap-2 p-2 mb-2 last:mb-0 hover:bg-gray-50 rounded-sm dark:hover:bg-page-dark"
                            href={link.url}
                            target="_blank"
                        >
                            <div className="w-6 h-6 bg-white rounded inline-flex items-center justify-center">
                                <img src={link.icon} alt={link.title} className="w-5 h-5 object-contain" />
                            </div>
                            <Typography tag="span" type="body2">
                                {link.url}
                            </Typography>
                        </a>
                    ))}
                </div>
            )}
        </Card>
    );
}

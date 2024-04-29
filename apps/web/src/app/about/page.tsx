import UserCard from '@/components/common/UserCard';
import { Card, Typography } from '@swai/ui';
import React from 'react';

export default function AboutPage() {
    return (
        <div className="container flex gap-10">
            <div className="shrink-0">
                <UserCard />
            </div>
            <Card className="grow">
                <Typography className="text-xl mb-10" tag="h1">
                    关于我
                </Typography>
                <Typography className="">LSSHUAISL，刘帅，来自重庆</Typography>
            </Card>
        </div>
    );
}

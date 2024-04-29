import React from 'react';
import UserCard from '@/components/common/UserCard';
import ArticleList from '@/components/home/ArticleList';

export default function HomePage() {
    return (
        <div className="tablet:container flex gap-10">
            <div className="shrink-0 mobile:hidden">
                <UserCard />
            </div>
            <div className="grow">
                <ArticleList />
            </div>
        </div>
    );
}

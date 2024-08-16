'use client';

import BoardList from '@/components/board/BoardList';
import UserCard from '@/components/common/UserCard';

export default () => {
    return (
        <div className="tablet:container flex gap-10">
            <div className="shrink-0 mobile:hidden">
                <UserCard />
            </div>
            <div className="grow">
                <BoardList />
            </div>
        </div>
    );
};

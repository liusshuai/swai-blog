'use client';

import React from 'react';
import { Typography } from '@swai/ui';
import { observer } from 'mobx-react-lite';
import RssButton from './RssButton';
import rootStore from '../../store/rootStore';

const UserDataOb = observer(({ store }: { store: typeof rootStore }) =>
    store.state.userInfo ? (
        <div>
            <div className={`w-40 h-40 rounded-full mx-auto overflow-hidden`}>
                <img referrerPolicy="no-referrer" src={store.state.userInfo.avatar} />
            </div>
            <div className="text-center mt-5">
                <Typography tag="div" type="title" weight="semibold" className="mb-2">
                    {store.state.userInfo.nickname}
                </Typography>
                <Typography type="body2">{store.state.userInfo.slogan}</Typography>
            </div>
            <RssButton />
            <div className="grid grid-cols-3 py-4 border-t border-b dark:border-divider-dark">
                <div className="text-center">
                    <Typography type="subtitle">{store.state.userInfo.follower}</Typography>
                    <Typography type="helper" className="text-xs">
                        订阅
                    </Typography>
                </div>
                <div className="text-center">
                    <Typography type="subtitle">{store.state.docNum}</Typography>
                    <Typography type="helper" className="text-xs">
                        文章
                    </Typography>
                </div>
                <div className="text-center cursor-not-allowed">
                    <Typography type="subtitle">{store.state.boardNum}</Typography>
                    <Typography type="helper" className="text-xs">
                        留言
                    </Typography>
                </div>
            </div>
        </div>
    ) : null,
);

export default function UserData() {
    return <UserDataOb store={rootStore} />;
}

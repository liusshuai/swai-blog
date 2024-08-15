import { getRepoDetail } from '@/api/repo/detail';
import { UserInfo } from '@swai/types';
import { observable, runInAction } from 'mobx';

interface RootStoreState {
    userInfo: null | UserInfo;
    namespace: string;
    docNum: number;
    boardNum: number;
}
function useRootStore() {
    const state = observable<RootStoreState>({
        userInfo: null,
        namespace: '',
        docNum: 0,
        boardNum: 0,
    });

    runInAction(() => {
        if (state.userInfo === null) {
            getRepoDetail().then((res) => {
                const { user, items_count, namespace } = res;
                runInAction(() => {
                    state.userInfo = {
                        nickname: user.name,
                        avatar: user.avatar_url,
                        slogan: user.description,
                        follower: user.followers_count,
                        docCount: items_count,
                        boardCount: 0,
                    };
                    state.namespace = namespace;
                    state.docNum = items_count;
                    state.boardNum = 0;
                });
            });
        }
    });

    return {
        state,
    };
}

export default useRootStore();

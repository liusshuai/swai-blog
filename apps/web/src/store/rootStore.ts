import { getAuthInfo } from '@/api/repo/auth';
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
        if (state.namespace === '') {
            getRepoDetail().then((res) => {
                const { items_count, namespace } = res;
                runInAction(() => {
                    state.namespace = namespace;
                    state.docNum = items_count;
                });
            });
        }
        if (state.userInfo === null) {
            getAuthInfo().then((res) => {
                state.userInfo = res;
                state.boardNum = res.boardCount;
            });
        }
    });

    function updateBoardNum(num: number) {
        runInAction(() => {
            state.boardNum = num;
        });
    }

    return {
        state,
        updateBoardNum,
    };
}

export default useRootStore();

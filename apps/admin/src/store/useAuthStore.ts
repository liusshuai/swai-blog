import { action, observable, runInAction } from 'mobx';
import { UserInfo } from '@swai/types';
import { getAdminInfo, logout } from '../api/login';

function useAuthStore() {
    const state = observable<{
        userInfo: null | UserInfo;
    }>({
        userInfo: null,
    });

    const getUserInfo = action(() => {
        return getAdminInfo().then((res) => {
            runInAction(() => {
                state.userInfo = res;
            });
        });
    });

    const doLogout = action(() => {
        return logout().then(() => {
            runInAction(() => {
                state.userInfo = null;
            });
        });
    });

    return {
        state,
        getUserInfo,
        doLogout,
    };
}

export default useAuthStore();

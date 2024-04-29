import { get } from '@/utils/request';
import { Doc } from '@swai/types';
import { action, observable, runInAction } from 'mobx';

function useDocStore() {
    const state = observable<{
        loading: boolean;
        currentPage: number;
        docList: Doc[];
        isEnd: boolean;
    }>({
        loading: false,
        currentPage: 0,
        docList: [],
        isEnd: false,
    });

    const getList = action(() => {
        if (state.loading || state.isEnd) return Promise.resolve([]);

        state.loading = true;
        return get<{ list: Doc[]; page: string }>('/api/v1/doc/getList', { page: state.currentPage.toString() })
            .then((res) => {
                const { list = [] } = res;
                runInAction(() => {
                    state.docList.push(...list);
                    state.isEnd = list.length < 10;
                });

                return list;
            })
            .finally(() => {
                runInAction(() => {
                    state.loading = false;
                });
            });
    });

    const addPage = action(() => state.currentPage++);

    return {
        state,
        getList,
        addPage,
    };
}

export default useDocStore();

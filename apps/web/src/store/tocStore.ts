import { getRepoToc } from '@/api/repo/toc';
import { Toc, TocType } from '@swai/types';
import { action, computed, observable, runInAction } from 'mobx';

export interface DocData {
    title: string;
    id: number;
}
export interface TocData {
    label: string;
    name: string;
    docs: DocData[];
    children?: TocData[];
}

function useTocStore() {
    const state = observable({
        loading: false,
        activeTocName: '',
    });
    const menus = observable<TocData>([]);
    const titleMap = observable<string, TocData>(new Map());

    const activeToc = computed(() => titleMap.get(state.activeTocName) || null);
    const activeTocDocs = computed<DocData[]>(() => activeToc.get()?.docs || []);

    const getData = action(() => {
        if (state.loading) return;
        state.loading = true;
        menus.length = 0;
        titleMap.clear();
        getRepoToc()
            .then((res) => {
                runInAction(() => {
                    initData(res);
                    state.activeTocName = menus[0].name;
                });
            })
            .finally(() => {
                runInAction(() => {
                    state.loading = true;
                });
            });
    });

    function initData(tocs: Toc[]) {
        const tocRelateMap: Map<
            string,
            {
                uuid: string;
                type: TocType;
                parent_uuid: string;
            }
        > = new Map();

        const unClassified: TocData = {
            label: '未分类',
            name: 'unclassified',
            docs: [],
        };

        for (const toc of tocs || []) {
            tocRelateMap.set(toc.uuid, {
                uuid: toc.uuid,
                parent_uuid: toc.parent_uuid,
                type: toc.type,
            });
            if (toc.type === 'TITLE') {
                const menu: TocData = observable({
                    label: toc.title,
                    name: toc.uuid,
                    docs: [],
                });
                if (toc.child_uuid) {
                    menu.children = [];
                }
                if (!toc.parent_uuid) {
                    menus.push(menu);
                } else {
                    const title = titleMap.get(toc.parent_uuid);
                    if (title) {
                        (title.children || (title.children = [])).push(menu);
                    }
                }
                titleMap.set(toc.uuid, menu);
            } else if (toc.type === 'DOC') {
                const doc = { title: toc.title, id: toc.id };
                if (toc.parent_uuid) {
                    let pToc = tocRelateMap.get(toc.parent_uuid);
                    while (pToc && pToc.type !== 'TITLE') {
                        pToc = tocRelateMap.get(pToc.parent_uuid);
                    }

                    if (pToc) {
                        const title = titleMap.get(pToc.uuid);
                        title && title.docs.push(doc);
                    }
                } else {
                    unClassified.docs.push(doc);
                }
            }
        }

        titleMap.set(unClassified.name, unClassified);
        menus.push(unClassified);
    }

    function setActiveToc(name: string) {
        runInAction(() => {
            state.activeTocName = name;
        });
    }

    return {
        state,
        menus,
        titleMap,
        activeToc,
        activeTocDocs,
        getData,
        setActiveToc,
    };
}

export default useTocStore();

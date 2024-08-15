import { getTouristLikedArticles } from '@/api/article/like';
import { getTouristInfo } from '@/api/tourist/register';
import { DEFAULT_TOURIST_AVATAR, createDiceBearAvatar } from '@/utils/diceBearAvatar';
import { TouristProfile } from '@swai/types';
import { computed, observable, runInAction } from 'mobx';

interface TouristStoreState {
    openEditDialog: boolean;
    profile: TouristProfile | null;
    likedDocs: number[];
}

function useTouristStore() {
    const state = observable<TouristStoreState>({
        openEditDialog: false,
        profile: null,
        likedDocs: [],
    });

    const touristAvatar = computed(() => {
        if (state.profile) {
            const { avatar_style, avatar_search } = state.profile;

            return createDiceBearAvatar(avatar_style, avatar_search);
        }

        return DEFAULT_TOURIST_AVATAR;
    });

    function setEditDialogVisible(visible: boolean) {
        runInAction(() => {
            state.openEditDialog = visible;
        });
    }

    function getTouristLikedDocs() {
        getTouristLikedArticles().then((data) => {
            runInAction(() => {
                state.likedDocs = data;
            });
        });
    }

    function likeDoc(docId: number) {
        runInAction(() => {
            const index = state.likedDocs.indexOf(docId);
            if (index === -1) {
                state.likedDocs = [...state.likedDocs, docId];
            }
        });
    }

    function unLikeDoc(docId: number) {
        runInAction(() => {
            const index = state.likedDocs.indexOf(docId);
            if (index > -1) {
                const likedDocs = [...state.likedDocs];
                likedDocs.splice(index, 1);
                state.likedDocs = likedDocs;
            }
        });
    }

    function getTouristProfile() {
        getTouristInfo().then((data) => {
            setTouristProfile(data);
            getTouristLikedDocs();
        });
    }

    function setTouristProfile(profile: TouristProfile) {
        runInAction(() => {
            state.profile = profile;
        });
    }

    runInAction(() => {
        if (!state.profile) {
            getTouristProfile();
        }
    });

    return {
        state,
        touristAvatar,
        setEditDialogVisible,
        setTouristProfile,
        likeDoc,
        unLikeDoc,
    };
}

export default useTouristStore();

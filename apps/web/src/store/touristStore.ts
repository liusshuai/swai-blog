import { createDiceBearAvatar } from "@/utils/diceBearAvatar";
import { get } from "@/utils/request";
import { TouristProfile } from "@swai/types";
import { computed, observable, runInAction } from "mobx";

interface TouristStoreState {
    openEditDialog: boolean;
    profile: TouristProfile | null;
}

function useTouristStore() {
    const state = observable<TouristStoreState>({
        openEditDialog: false,
        profile: null,
    });

    const touristAvatar = computed(() => {
        if (state.profile) {
            const { avatar_style, avatar_search } = state.profile;

            return createDiceBearAvatar(avatar_style, avatar_search);
        }

        return '';
    });

    function setEditDialogVisible(visible: boolean) {
        runInAction(() => {
            state.openEditDialog = visible;
        });
    }

    function getTouristProfile() {
        get<TouristProfile>('/api/v1/tourist/getTouristInfo')
            .then((data) => {
                console.log(data);
                setTouristProfile(data);
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
    };
}

export default useTouristStore();

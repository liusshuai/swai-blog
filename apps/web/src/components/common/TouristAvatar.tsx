'use client'
import React from "react";
import touristStore from '../../store/touristStore';
import { observer } from "mobx-react-lite";
import { DEFAULT_TOURIST_AVATAR } from "@/utils/diceBearAvatar";

const TouristAvatar = observer(({ store }: { store: typeof touristStore }) => {
    return <div className="w-10 h-10 rounded-full cursor-pointer overflow-hidden" onClick={() => store.setEditDialogVisible(true)}>
        <img className="w-full h-full" src={store.touristAvatar.get() || DEFAULT_TOURIST_AVATAR} alt="" />
    </div>
});

export default () => <TouristAvatar store={touristStore} /> 

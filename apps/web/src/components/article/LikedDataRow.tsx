import React, { useEffect, useState } from 'react';
import { LikeDarkIcon, LikeIcon } from '@swai/icon';
import { observer } from 'mobx-react-lite';
import touristStore from '@/store/touristStore';
import { likeArticle, unLikeArticle } from '@/api/article/like';

interface LikedDataRowProps {
    docId: number;
    className?: string;
    onAdd?: () => void;
    onReduce?: () => void;
}

const LikedDataRow = observer((props: LikedDataRowProps & { store: typeof touristStore }) => {
    const { className, docId, store } = props;

    const [liked, setLiked] = useState(false);

    useEffect(() => {
        setLiked(store.state.likedDocs.includes(docId));
    }, [store.state.likedDocs, docId]);

    function changeDocLikeState() {
        if (!store.state.profile) {
            store.setEditDialogVisible(true);
            return;
        }
        if (liked) {
            return unLikeArticle(docId).then(() => {
                store.unLikeDoc(docId);
                props.onReduce && props.onReduce();
            });
        } else {
            return likeArticle(docId).then(() => {
                store.likeDoc(docId);
                props.onAdd && props.onAdd();
            });
        }
    }

    return React.createElement(liked ? LikeDarkIcon : LikeIcon, {
        className: className,
        color: liked ? '#ef4444' : '',
        onClick: changeDocLikeState,
    });
});

export default (props: LikedDataRowProps) => <LikedDataRow store={touristStore} {...props} />;

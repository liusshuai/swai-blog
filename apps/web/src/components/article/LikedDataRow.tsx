import React, { useEffect, useState } from 'react';
import { LikeDarkIcon, LikeIcon } from '@swai/icon';
import { post } from '@/utils/request';
import { observer } from 'mobx-react-lite';
import touristStore from '@/store/touristStore';

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
        if (liked) {
            return unLikeArticle().then(() => {
                store.unLikeDoc(docId);
                props.onReduce && props.onReduce();
            });
        } else {
            return likeArticle().then(() => {
                store.likeDoc(docId);
                props.onAdd && props.onAdd();
            });
        }
    }

    function likeArticle() {
        return post('/api/v1/doc/like', {
            docId,
        });
    }

    function unLikeArticle() {
        return post('/api/v1/doc/unLike', {
            docId,
        });
    }

    return React.createElement(liked ? LikeDarkIcon : LikeIcon, {
        className: className,
        color: liked ? '#ef4444' : '',
        onClick: changeDocLikeState,
    });
});

export default (props: LikedDataRowProps) => <LikedDataRow store={touristStore} {...props} />;

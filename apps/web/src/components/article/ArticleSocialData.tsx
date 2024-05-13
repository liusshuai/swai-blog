'use client'
import { CommentIcon } from '@swai/icon';
import React, { useContext, useMemo } from 'react';
import LikedDataRow from './LikedDataRow';
import { DocDetail } from '@swai/types';
import { ArticleDataContext } from './ArticleDetail';

interface ArticleSocialDataProps {
    detail: DocDetail;
    direction?: 'col' | 'row',
    clickComment?: () => void;
}

export default function ArticleSocialData(props: ArticleSocialDataProps) {

    const { likeCount, commentCount, setLikeCount } = useContext(ArticleDataContext);

    const { detail, direction = 'row', clickComment } = props;

    const SocialItemClasses = useMemo(() => {
        return `cursor-pointer flex items-center justify-center ${direction === 'col' ? 'flex-col py-3 border-b dark:border-dark last:border-none' : 'w-1/3 gap-2.5'}`;
    }, [direction]);

    return <div>
        <div className={`flex items-center text-secondary dark:text-secondary-dark ${direction === 'col' ? 'flex-col gap-2.5' : ''}`}>
            <div className={SocialItemClasses}>
                <a href={`https://www.yuque.com${detail.sourceUrl}`} target="_blank">
                    <img className="w-8 h-8" src="/image/yuque.svg" />
                </a>
            </div>
            <div className={SocialItemClasses}>
                <LikedDataRow
                    docId={detail.id}
                    onAdd={() => setLikeCount(likeCount + 1)}
                    onReduce={() => setLikeCount(likeCount - 1)}
                />
                <span>{likeCount}</span>
            </div>
            <div className={SocialItemClasses} onClick={clickComment}>
                <CommentIcon />
                <span>{commentCount}</span>
            </div>
        </div>
    </div>
}

'use client'
import { Card, Typography, useMobileMediaQuery } from '@swai/ui';
import type { DocDetail } from '@swai/types';
import DocBaseInfo from '@/components/common/DocBaseInfo';
import DocContent from '@/components/article/DocContent';
import ArticleSocialData from '@/components/article/ArticleSocialData';
import ArticleClientData from '@/components/article/ArticleClientData';
import { createContext, useState } from 'react';

interface ArticleDataContextPayload {
    readCount: number;
    likeCount: number;
    commentCount: number;

    setLikeCount: (val: number) => void;
    setCommentCount: (val: number) => void;
}
export const ArticleDataContext = createContext<ArticleDataContextPayload>({
    readCount: 0,
    likeCount: 0,
    commentCount: 0,
    setLikeCount: () => {},
    setCommentCount: () => {},
});

export default function({ detail }: { detail: DocDetail }) {

    const isMobile = useMobileMediaQuery();

    const [likeCount, setLikeCount] = useState(detail.likes_count || 0);
    const [commentCount, setCommentCount] = useState(detail.comment_count || 0);

    function scrollToComment() {
        const node = document.getElementById('article-comments');
        node && node.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return <ArticleDataContext.Provider value={{
        readCount: detail.read_count,
        likeCount,
        commentCount,
        setLikeCount,
        setCommentCount,
    }}>
        <div className='tablet:flex tablet:justify-center tablet:gap-5 tablet:container'>
            <div className='tablet:w-[790px]'>
                <Card className="py-10 w-full mobile:rounded-none mb-8">
                    <article className="text-[15px]">
                        <div className="mb-8 tablet:mb-14">
                            <Typography className="" tag="div" type="heading" weight="medium">
                                {detail.title}
                            </Typography>
                            <DocBaseInfo doc={detail} />
                        </div>
                        <DocContent sourceUrl={detail.sourceUrl} content={detail.body_html} />
                    </article>
                </Card>
                <div id="article-comments"></div>
                <ArticleClientData detail={detail} />
            </div>
            {isMobile ? null : <div>
                <Card className='w-24 sticky top-[calc(var(--nav-height)+20px)] text-secondary dark:text-secondary-dark'>
                    <ArticleSocialData direction="col" detail={detail} clickComment={scrollToComment} />
                </Card>
            </div>}
        </div>
    </ArticleDataContext.Provider>
}

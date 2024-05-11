'use client'

import { Comment, DocDetail } from "@swai/types";
import { BottomToolBar, Card, Drawer, useMobileMediaQuery } from "@swai/ui";
import { useContext, useEffect, useRef, useState } from "react";
import CommentInput from "../comments/CommentInput";
import CommentList from "../comments/CommentList";
import { addCommentReply, addDocComment } from "api/comment/addComment";
import { getDocComments } from "api/comment/getComment";
import { CommentContext, SendCallback } from "../comments/CommentContext";
import ArticleSocialData from "./ArticleSocialData";
import { ArticleDataContext } from "./ArticleDetail";

export default function({ detail }: { detail: DocDetail }) {

    const isMobile = useMobileMediaQuery();

    const { commentCount, setCommentCount } = useContext(ArticleDataContext);

    const curPage = useRef<number>(1);
    const [openComment, setOpenComment] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);

    function getComments() {
        getDocComments({
            docId: detail.id,
            page: curPage.current,
            pageSize: 5,
        }).then((res) => {
            setComments(res);
        });
    }

    useEffect(() => {
        getComments();
    }, [detail]);

    function onCommentSend(content: string, done: SendCallback, onError: SendCallback) {
        addDocComment({
            docId: detail.id,
            content,
        }).then(() => {
            curPage.current = 1;
            getComments();
            setCommentCount(commentCount + 1);
            done();
        }).finally(onError);
    }

    function onReplySend(mainId: number, toId: string, content: string, done: SendCallback, onError: SendCallback) {
        addCommentReply({
            comment_id: mainId,
            content,
            to: toId,
        }).then((reply) => {
            const commentIndex = comments.findIndex(c => c.id === mainId);
            const comment = comments[commentIndex];
            if (comment) {
                comment.replies.unshift(reply);
                comments.splice(commentIndex, 1, comment);
                setCommentCount(commentCount + 1);
                setComments([...comments]);
            }
            done();
        }).catch((e) => {
            alert(e.message);
            onError();
        });
    }

    return <CommentContext.Provider value={{
        comments,
        onCommentSend,
        onReplySend,
    }}>
        {isMobile ? <BottomToolBar>
            <ArticleSocialData detail={detail} clickComment={() => setOpenComment(true)} />
        </BottomToolBar> : <Card>
            <CommentInput />
            <CommentList />
        </Card>}

        <Drawer title="评论" open={isMobile && openComment} direction="bottom" onClose={() => setOpenComment(false)}>
            <CommentInput />
            <CommentList />
        </Drawer>
    </CommentContext.Provider>
}

'use client';
import type { Comment } from '@swai/types';
import { useEffect, useState } from 'react';
import { CommentContext, type SendCallback } from '../comments/CommentContext';
import { Button, Card, Typography } from '@swai/ui';
import CommentInput from '../comments/CommentInput';
import CommentList from '../comments/CommentList';
import { addBoard } from '@/api/board/add';
import { getBoardList } from '@/api/board/list';
import { addCommentReply } from '@/api/comment/addComment';
import rootStore from '@/store/rootStore';
import { observer } from 'mobx-react-lite';

const BoardList = observer((props: { store: typeof rootStore }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(getBoards, [page]);

    function getBoards() {
        setLoading(true);
        getBoardList({
            page,
            pageSize: 20,
        })
            .then((res) => {
                const list = [...comments, ...res.comments];
                setComments(list);
                setTotal(res.count);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function getMore() {
        if (loading) return;
        setPage(page + 1);
    }

    function updateBoardNum(num: number, direction: 0 | 1) {
        const val = props.store.state.boardNum;
        props.store.updateBoardNum(direction === 1 ? val + num : val - num);
    }

    function onCommentSend(content: string, done: SendCallback, onError: SendCallback) {
        addBoard(content)
            .then((res) => {
                setComments([res, ...comments]);
                updateBoardNum(1, 1);
                done();
            })
            .finally(onError);
    }

    function onReplySend(mainId: number, toId: string, content: string, done: SendCallback, onError: SendCallback) {
        addCommentReply({
            comment_id: mainId,
            content,
            to: toId,
        })
            .then((reply) => {
                const commentIndex = comments.findIndex((c) => c.id === mainId);
                const comment = comments[commentIndex];
                if (comment) {
                    (comment.replies || (comment.replies = [])).unshift(reply);
                    comments.splice(commentIndex, 1, comment);
                    setComments([...comments]);
                    updateBoardNum(1, 1);
                }
                done();
            })
            .catch((e) => {
                alert(e.message);
                onError();
            });
    }

    function onCommentRemove(comment: Comment) {
        setComments((list) => {
            const index = list.findIndex((c) => c.id === comment.id);
            if (index > -1) {
                list.splice(index, 1);
                updateBoardNum(comment.replyCount + 1, 0);
            }

            return [...list];
        });
    }

    function onReplyRemove(mainId: number, replyId: number) {
        const commentIndex = comments.findIndex((c) => c.id === mainId);
        const comment = comments[commentIndex];
        if (comment && comment.replies.length > 0) {
            const replyIndex = comment.replies.findIndex((r) => (r.id = replyId));
            if (replyIndex > -1) {
                comment.replies.splice(replyIndex, 1);
                comment.replyCount -= 1;
                comments.splice(commentIndex, 1, comment);
                setComments([...comments]);
                updateBoardNum(1, 0);
            }
        }
    }

    return (
        <CommentContext.Provider
            value={{
                comments,
                onCommentSend,
                onReplySend,
                onCommentRemove,
                onReplyRemove,
            }}
        >
            <Card className="mb-5">
                <Typography type="title" className="mb-4">
                    留言板({props.store.state.boardNum})
                </Typography>
                <CommentInput />
            </Card>
            <Card>
                <CommentList emptyText="来抢沙发吧～" />
                {total === comments.length ? null : (
                    <div className="py-2 flex justify-center">
                        <Button className="mt-2" loading={loading} onClick={getMore}>
                            加载更多
                        </Button>
                    </div>
                )}
            </Card>
        </CommentContext.Provider>
    );
});

export default () => <BoardList store={rootStore} />;

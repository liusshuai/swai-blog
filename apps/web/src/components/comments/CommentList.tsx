import React, { useContext, useEffect, useState } from 'react';
import CommentItem from './CommentItem';
import { CommentContext } from './CommentContext';
import { Dialog, useMobileMediaQuery } from '@swai/ui';
import { Comment, CommentReply } from '@swai/types';
import Drawer, { DrawerProps } from '@swai/ui/lib/Drawer/Drawer';
import { DialogProps } from '@swai/ui/lib/Dialog/Dialog';
import { getCommentReplies } from 'api/comment/getComment';

export default function (props: { emptyText?: string }) {
    const isMobile = useMobileMediaQuery();
    const { comments = [] } = useContext(CommentContext);
    const [openReplies, setOpenReplies] = useState<boolean>(false);
    const [curComment, setCurComment] = useState<Comment | null>(null);
    const [curCommentAllReplies, setCurCommentAllReplies] = useState<CommentReply[]>([]);

    useEffect(() => {
        if (curComment && curComment.replyCount > 2) {
            getReplies(curComment.id);
        }
    }, [curComment]);

    function getReplies(commentId: number) {
        getCommentReplies(commentId).then((res) => {
            setCurCommentAllReplies(res.replies);
        });
    }

    function viewAllReply(comment: Comment) {
        setCurComment(comment);
        if (comment.replyCount > 2) {
            setOpenReplies(true);
        }
    }

    function onReplyRemove(reply: Comment | CommentReply) {
        const index = curCommentAllReplies.findIndex((r) => r.id === reply.id);
        if (index > -1) {
            curCommentAllReplies.splice(index, 1);
            setCurCommentAllReplies([...curCommentAllReplies]);
        }
    }

    return (
        <div className="mt-5">
            {comments.length > 0 ? (
                comments.map((comment) => (
                    <CommentItem mainId={comment.id} comment={comment} key={comment.id}>
                        {comment ? (
                            <>
                                {(comment.replies || []).map((reply) => (
                                    <CommentItem mainId={comment.id} comment={reply} key={reply.id} />
                                ))}
                                {comment.replyCount > 2 ? (
                                    <button
                                        className="text-xs text-link hover:text-link-hover"
                                        onClick={() => viewAllReply(comment)}
                                    >
                                        查看全部{comment.replyCount}条回复
                                    </button>
                                ) : null}
                            </>
                        ) : null}
                    </CommentItem>
                ))
            ) : props.emptyText ? (
                <p className="h-12 flex justify-center items-center text-helper">{props.emptyText}</p>
            ) : null}

            {React.createElement<DrawerProps & DialogProps>(
                isMobile ? Drawer : Dialog,
                {
                    title: '全部回复',
                    open: openReplies,
                    onClose: () => setOpenReplies(false),
                    size: isMobile ? '100%' : undefined,
                    direction: isMobile ? 'right' : undefined,
                    width: isMobile ? undefined : '600px',
                },
                <>
                    {curComment &&
                        (curCommentAllReplies || []).map((reply) => (
                            <CommentItem
                                mainId={curComment!.id}
                                comment={reply}
                                key={reply.id}
                                onRemove={onReplyRemove}
                            />
                        ))}
                </>,
            )}
        </div>
    );
}

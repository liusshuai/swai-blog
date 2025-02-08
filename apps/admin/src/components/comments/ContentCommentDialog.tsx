import { Dialog, Pagination, openDialog } from '@swai/ui';
import CommentItem from './CommentItem';
import { forwardRef, startTransition, useEffect, useImperativeHandle, useState } from 'react';
import { Comment, CommentReply } from '@swai/types';
import { addReply, getCommentReplies, updateReply } from '../../api/comment';

export interface ContentCommentDialogRef {
    open: (comment: Comment) => void;
}
interface ContentCommentDialogProps {
    onReplyCountChanged?: (id: number, count: number) => void;
}
export default forwardRef<ContentCommentDialogRef, ContentCommentDialogProps>((props, ref) => {
    const [open, setOpen] = useState<boolean>(false);
    const [comment, setComment] = useState<null | Comment>(null);
    const [replies, setReplies] = useState<CommentReply[]>([]);
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);

    useImperativeHandle(ref, () => ({
        open: (comment: Comment) => {
            startTransition(() => {
                setComment(comment);
                setOpen(true);
            });
        },
    }));

    useEffect(() => {
        getReplies();
    }, [comment]);

    function getReplies(page = 1) {
        if (comment) {
            getCommentReplies({
                page,
                pageSize: 5,
                comment_id: comment.id,
            }).then((res) => {
                console.log(res);
                setReplies([...res.replies]);
                setTotal(res.count);
                props.onReplyCountChanged && props.onReplyCountChanged(comment.id, res.count);
            });
        }
    }

    function onPageChange(page: number) {
        setPage(() => {
            getReplies(page);

            return page;
        });
    }

    function onclose() {
        setOpen(false);
        setComment(null);
    }

    function onStateUpdate(id: number) {
        return (data: { visible?: boolean; is_deleted?: boolean }) => {
            const { visible, is_deleted } = data;
            let title: string = '';
            if (is_deleted !== undefined) {
                title = `是否${is_deleted ? '删除' : '恢复'}该回复`;
            } else if (visible !== undefined) {
                title = `是否${visible ? '展示' : '隐藏'}该回复`;
            }

            title &&
                openDialog({
                    title,
                    type: 'confirm',
                    showClose: false,
                    onConfirm: (close) => {
                        return updateReply({
                            id,
                            ...data,
                        }).then(() => {
                            close();
                            onPageChange(page);
                        });
                    },
                });
        };
    }

    function onReply(data: { to: string; content: string }, callback: () => void) {
        addReply({
            comment_id: comment!.id,
            ...data,
        }).then(() => {
            callback();
            onPageChange(1);
        });
    }

    return (
        <Dialog
            open={open}
            closeOnClickOverlay={false}
            title="详情"
            width="700px"
            onClose={onclose}
            actions={
                <Pagination
                    className="pt-4 flex justify-center"
                    page={page}
                    pageSize={5}
                    total={total}
                    pageChange={onPageChange}
                />
            }
        >
            {comment ? (
                <CommentItem payload={comment} onReply={onReply}>
                    <ul>
                        {replies.map((reply) => (
                            <li className="py-4 border-b" key={reply.id}>
                                <CommentItem
                                    payload={reply}
                                    type="reply"
                                    onStateUpdate={onStateUpdate(reply.id)}
                                    onReply={onReply}
                                />
                            </li>
                        ))}
                    </ul>
                </CommentItem>
            ) : null}
        </Dialog>
    );
});

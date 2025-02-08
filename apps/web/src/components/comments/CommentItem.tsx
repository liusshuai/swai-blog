'use client';
import React, { useContext, useMemo, useState } from 'react';
import CommentInput from './CommentInput';
import { Comment, CommentReply } from '@swai/types';
import { createDiceBearAvatar } from '@/utils/diceBearAvatar';
import { formatTime } from '@/utils/formatTime';
import { CommentIcon, DeleteIcon } from '@swai/icon';
import { CommentContext } from './CommentContext';
import { observer } from 'mobx-react-lite';
import touristStore from '@/store/touristStore';
import { openConfirmDialog } from '@swai/ui';
import { removeComment, removeReply } from 'api/comment/removeComment';

interface CommentItemProps {
    mainId: number;
    comment: Comment | CommentReply;
    children?: React.ReactNode;

    onRemove?: (comment: Comment | CommentReply) => void;
}

const CommentItem = observer((props: CommentItemProps & { store: typeof touristStore }) => {
    const { onReplySend, onCommentRemove, onReplyRemove } = useContext(CommentContext);

    const { mainId, comment, store } = props;

    const [showReply, setShowReply] = useState(false);

    const fromProfile = useMemo(() => comment.from, [comment]);
    const toProfile = useMemo(() => (comment as CommentReply).to, [comment]);
    const isFromMe = useMemo(() => {
        return comment.from.id === store.state.profile?.id;
    }, [comment.from, store.state.profile]);

    function onReplyClick() {
        if (store.state.profile) {
            setShowReply(!showReply);
        } else {
            store.setEditDialogVisible(true);
        }
    }

    function onReply(content: string, done: () => void, onError: () => void) {
        onReplySend(
            mainId,
            comment.from.id,
            content,
            () => {
                setShowReply(false);
                done();
            },
            onError,
        );
    }

    function renderNickname(nickname: string, fromId: string) {
        const isFromMe = fromId === store.state.profile?.id;
        if (!isFromMe) {
            return nickname;
        } else {
            return (
                <>
                    {nickname}
                    <span className="inline-block ms-1.5 w-5 h-5 text-white text-xs text-center rounded-[2px] bg-primary">
                        我
                    </span>
                </>
            );
        }
    }

    function onRemove() {
        openConfirmDialog({
            children: '是否删除该条回复？',
            onCancel: (done) => {
                done();
            },
            onConfirm: onRemoveConfirm,
        });
    }

    function onRemoveConfirm(done: () => void) {
        if (toProfile) {
            // 删除回复
            return removeReply(comment.id).then(() => {
                onReplyRemove(mainId, comment.id);
                props.onRemove && props.onRemove(comment);
                done();
            });
        } else {
            // 删除评论
            return removeComment(comment.id).then(() => {
                onCommentRemove(comment as Comment);
                props.onRemove && props.onRemove(comment);
                done();
            });
        }
    }

    return (
        <div className="flex gap-4 py-2.5">
            <div className="shrink-0 w-10 h-10 rounded-full overflow-hidden text-center leading-10 text-xl text-white">
                <img src={createDiceBearAvatar(fromProfile.avatar_style, fromProfile.avatar_search)} alt="" />
            </div>
            <div className="text-md grow">
                <div className="group/reply">
                    <div className="text-secondary mb-2 dark:text-secondary-dark">
                        <span>
                            {renderNickname(fromProfile.nickname, fromProfile.id)}
                            {toProfile ? (
                                <>
                                    <span className="mx-2 text-primary dark:text-primary-dark">回复</span>{' '}
                                    {renderNickname(toProfile.nickname, toProfile.id)}
                                </>
                            ) : null}
                        </span>
                        <span className="text-helper ms-2 dark:text-helper-dark">{formatTime(comment.create_at)}</span>
                    </div>
                    <pre className="whitespace-pre-wrap leading-7 dark:text-primary-dark">{comment.content}</pre>
                    <div className="mt-2 flex items-center text-xs text-secondary dark:text-secondary-dark">
                        <button className="inline-flex items-center hover:text-brand me-5" onClick={onReplyClick}>
                            <CommentIcon size={16} className="me-2" /> {showReply ? '取消回复' : '回复'}
                        </button>
                        {isFromMe ? (
                            <button
                                className="inline-flex tablet:group-hover/reply:inline-flex tablet:hidden items-center hover:text-primary hover:dark:text-primary-dark"
                                onClick={onRemove}
                            >
                                <DeleteIcon size={14} className="me-2" /> 删除
                            </button>
                        ) : null}
                    </div>
                </div>
                {showReply ? (
                    <CommentInput className="mt-2" placeholder={`回复 ${fromProfile.nickname}`} onSend={onReply} />
                ) : null}
                {props.children ? <div className="mt-2.5">{props.children}</div> : null}
            </div>
        </div>
    );
});

export default (props: CommentItemProps) => <CommentItem store={touristStore} {...props} />;

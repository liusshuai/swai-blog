'use client'
import React, { useContext, useMemo, useState } from 'react';
import CommentInput from './CommentInput';
import { Comment, CommentReply } from '@swai/types';
import { createDiceBearAvatar } from '@/utils/diceBearAvatar';
import { formatTime } from '@/utils/formatTime';
import { CommentIcon } from '@swai/icon';
import { CommentContext } from './CommentContext';

interface CommentItemProps {
    mainId: number;
    comment: Comment | CommentReply;
    children?: React.ReactNode;
}

export default function(props: CommentItemProps) {
    const { onReplySend } = useContext(CommentContext);

    const { mainId, comment } = props;

    const [showReply, setShowReply] = useState(false);

    const fromProfile = useMemo(() => comment.from, [comment]);
    const toProfile = useMemo(() => (comment as CommentReply).to, [comment]);

    function onReply(content: string, done: () => void, onError: () => void) {
        onReplySend(mainId, comment.from.id, content, () => {
            setShowReply(false);
            done();
        }, onError);
    }

    return <div className='flex gap-4 py-2.5'> 
        <div className='shrink-0 w-10 h-10 rounded-full overflow-hidden text-center leading-10 text-xl text-white'>
            <img src={createDiceBearAvatar(fromProfile.avatar_style, fromProfile.avatar_search)} alt='' />
        </div>
        <div className='text-md grow'>
            <div className='group/reply'>
                <div className='text-secondary mb-2 dark:text-secondary-dark'>
                    <span>
                        { fromProfile.nickname }
                        { toProfile ? <><span className='mx-2 text-primary dark:text-primary-dark'>回复</span> { toProfile.nickname }</> : null }
                    </span>
                    <span className='text-helper ms-2 dark:text-helper-dark'>{ formatTime(comment.create_at) }</span>
                </div>
                <pre className='whitespace-pre-wrap leading-7 dark:text-primary-dark'>
                    {comment.content}
                </pre>
                <div className='mt-2'>
                    <button className='text-xs text-secondary dark:text-secondary-dark' onClick={() => setShowReply(!showReply)}>
                        { showReply ? '取消回复' : <span className='inline-flex items-center hover:text-brand'>
                            <CommentIcon size={16} className='me-2' /> 回复
                        </span> }
                    </button>
                </div>
            </div>
            { showReply ? <CommentInput className='mt-2' placeholder={`回复 ${fromProfile.nickname}`} onSend={onReply} /> : null }
            { props.children ? <div className='mt-2.5'>{ props.children }</div> : null }
        </div>
    </div>
}

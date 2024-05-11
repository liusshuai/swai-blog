'use client'
import { Button, Textarea } from '@swai/ui';
import React, { FormEvent, useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import touristStore from '@/store/touristStore';
import TouristAvatar from '../common/TouristAvatar';
import { CommentContext, SendCallback } from './CommentContext';

interface CommentInputProps {
    className?: string;
    placeholder?: string;

    onSend?: (content: string, done: SendCallback, onError: SendCallback) => void;
}

const CommentInput = observer((props: CommentInputProps & { store: typeof touristStore }) => {

    const { onCommentSend } = useContext(CommentContext);

    const [content, setContent] = useState<string>('');
    const [sending, setSending] = useState<boolean>(false);

    function onInput(e: FormEvent<HTMLInputElement>) {
        setContent((e.target as HTMLInputElement).value);
    }

    function onSend() {
        if (content) {
            setSending(true);
            (props.onSend || onCommentSend)(content, () => {
                setSending(false);
                setContent('');
            }, () => {
                setSending(false);
            });
        }
    }

    return <div className={props.className}>
        <Textarea
            disabled={!Boolean(props.store.state.profile)}
            maxLength={1000}
            value={content}
            placeholder={props.placeholder || '平等的我平等的你，平等的我们，请礼貌发言...'}
            rows={2}
            prepend={<div className='inline-flex items-center'>
                <TouristAvatar />
                <span>{ props.store.state.profile?.nickname || '点击编辑信息' }</span>
            </div>}
            append={
                <div className='flex items-center justify-between'>
                    <div>
                        {/* 表情包预留 */}
                    </div>
                    <Button loading={sending} onClick={onSend}>发送</Button>
                </div>
            }
            onInput={onInput}
        />
    </div>
});

export default (props: CommentInputProps) => <CommentInput store={touristStore} {...props} />

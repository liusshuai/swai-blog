import { Comment, CommentReply } from '@swai/types';
import { Button, Textarea } from '@swai/ui';
import { FormEvent, useMemo, useState } from 'react';
import { formatTime } from '../../utils/formatTime';

interface CommentItemProps {
    payload: Comment | CommentReply;
    type?: 'comment' | 'reply';
    children?: React.ReactNode;

    onStateUpdate?: (data: { visible?: boolean; is_deleted?: boolean }) => void;
    onReply?: (data: { to: string; content: string }, callback: () => void) => void;
}

export default (props: CommentItemProps) => {
    const { type = 'comment', payload } = props;
    const from = payload.from;
    const to = (payload as CommentReply).to;

    const [content, setContent] = useState<string>('');
    const [showReplyInput, setShowReplyInput] = useState<boolean>(false);

    const avatarClasses = useMemo(() => {
        let classes = 'rounded-full object-contain';
        if (type === 'comment') {
            classes += ' w-12 h-12';
        } else {
            classes += ' w-8 h-8';
        }

        return classes;
    }, [type]);

    function onContentInput(e: FormEvent<HTMLInputElement>) {
        setContent((e.target as HTMLInputElement).value);
    }

    function onSend() {
        props.onReply &&
            props.onReply(
                {
                    to: from.id,
                    content,
                },
                () => {
                    setContent('');
                },
            );
    }

    function onUpdate(data: { visible?: boolean; is_deleted?: boolean }) {
        props.onStateUpdate && props.onStateUpdate(data);
    }

    return (
        <div className={`flex ${payload.is_deleted ? 'opacity-50' : ''}`}>
            <div className="me-5 shrink-0">
                <img
                    className={avatarClasses}
                    src={`https://api.dicebear.com/9.x/${from.avatar_style}/svg${from.avatar_search ? `?${from.avatar_search}` : ''}`}
                    alt=""
                />
            </div>
            <div className="grow">
                <div className="group/comment">
                    <div className="font-semibold mb-1">
                        {from.nickname}
                        {to ? (
                            <>
                                <span className="font-normal text-helper mx-2">回复</span>
                                {to.nickname}
                            </>
                        ) : null}
                    </div>
                    <p>{payload.content}</p>
                    <div className="text-sm mt-2">
                        <span className="text-helper">{formatTime(payload.create_at)}</span>
                        {payload.is_deleted ? (
                            <>
                                <span className="mx-2">已删除</span>
                                <button onClick={() => onUpdate({ is_deleted: false })}>恢复</button>
                            </>
                        ) : (
                            <>
                                <button className="mx-2" onClick={() => setShowReplyInput(!showReplyInput)}>
                                    {showReplyInput ? '取消回复' : '回复'}
                                </button>
                                <button className="me-2" onClick={() => onUpdate({ visible: !payload.visible })}>
                                    {payload.visible ? '隐藏' : '展示'}
                                </button>
                                {type === 'reply' ? (
                                    <button
                                        className="hidden group-hover/comment:inline-block"
                                        onClick={() => onUpdate({ is_deleted: true })}
                                    >
                                        删除
                                    </button>
                                ) : null}
                            </>
                        )}
                    </div>
                </div>
                {showReplyInput ? (
                    <Textarea
                        value={content}
                        className="mt-2"
                        placeholder="请输入回复内容"
                        append={
                            <div className="flex items-center justify-end">
                                <Button disabled={!content} onClick={onSend}>
                                    发送
                                </Button>
                            </div>
                        }
                        onInput={onContentInput}
                    />
                ) : (
                    false
                )}
                {props.children}
            </div>
        </div>
    );
};

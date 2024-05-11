import { Comment, CommentReply } from "@swai/types";
import { createContext } from "react";

export type SendCallback = () => void;
export interface CommentContextPayload {
    comments: Comment[];
    onCommentSend: (content: string, done: SendCallback, onError: SendCallback) => void;
    onReplySend: (mainId: number, toId: string, content: string, done: SendCallback, onError: SendCallback) => void;
}

export const CommentContext = createContext<CommentContextPayload>({
    comments: [],
    onCommentSend: () => {},
    onReplySend: () => {},
});

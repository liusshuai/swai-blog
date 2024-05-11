import { post } from "@/utils/request";
import { CommentReply } from "@swai/types";

export interface AddDocCommentParams {
    docId: number;
    content: string;
}

export function addDocComment(data: AddDocCommentParams) {
    return post('/api/v1/doc/addComment', data);
}

export interface AddCommentReplyParams {
    comment_id: number;
    to: string;
    content: string;
}
export function addCommentReply(data: AddCommentReplyParams) {
    return post<CommentReply>('/api/v1/reply/add', data);
}
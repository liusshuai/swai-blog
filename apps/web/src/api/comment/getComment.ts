import { get } from "@/utils/request";
import { Comment, CommentReply } from "@swai/types";

export interface GetDocCommentsParams {
    docId: number;
    page?: number;
    pageSize?: number;
}
export function getDocComments(params: GetDocCommentsParams) {
    return get<Comment[]>('/api/v1/doc/getComments', params as any);
}

export function getCommentReplies(commentId: number) {
    return get<{
        replies: CommentReply[];
        count: number;
    }>('/api/v1/reply/get', { comment_id: commentId });
}

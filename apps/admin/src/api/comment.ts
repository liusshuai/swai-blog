import { Comment, CommentReply } from '@swai/types';
import { post } from './request';
import { PaginationParams } from './types';

interface GetCommentListparams extends PaginationParams {
    contentId?: string;
    type?: string;
    visible?: string;
    is_deleted?: string;
}
export function getCommentList(params: GetCommentListparams) {
    return post<{
        total: number;
        list: Comment[];
    }>('/api/v1/admin/comment/getList', {
        ...params,
        visible: params.visible ? (params.visible === '1' ? true : false) : undefined,
        is_deleted: params.is_deleted ? (params.is_deleted === '1' ? true : false) : undefined,
    });
}

export interface UpdateCommentparams {
    id: number;
    visible?: boolean;
    is_deleted?: boolean;
}
export function updateComment(params: UpdateCommentparams) {
    return post<{
        id: number;
        success: boolean;
    }>('/api/v1/admin/comment/update', params);
}

interface GetCommentRepliesParams extends PaginationParams {
    comment_id: number;
}
export function getCommentReplies(params: GetCommentRepliesParams) {
    return post<{
        replies: CommentReply[];
        count: number;
    }>('/api/v1/admin/comment/getReplies', params);
}

interface AddReplyParams {
    comment_id: number;
    content: string;
    to: string;
}
export function addReply(params: AddReplyParams) {
    return post('/api/v1/admin/comment/addReply', params);
}

interface UpdateReplyParams extends UpdateCommentparams {}
export function updateReply(params: UpdateReplyParams) {
    return post('/api/v1/admin/comment/updateReply', params);
}

export function removeReply(id: number) {
    return post('/api/v1/admin/comment/removeReply', { id });
}

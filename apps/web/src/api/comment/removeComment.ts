import { post } from "@/utils/request";

export function removeComment(comment_id: number) {
    return post('/api/v1/comment/remove', { comment_id });
}

export function removeReply(reply_id: number) {
    return post('/api/v1/reply/remove', { reply_id });
}

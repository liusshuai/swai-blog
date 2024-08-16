import { post } from '@/utils/request';
import type { Comment } from '@swai/types';

export function addBoard(content: string) {
    return post<Comment>('/api/v1/board/add', { content });
}

import { get } from '@/utils/request';
import type { Comment } from '@swai/types';

interface GetBoardListParmas {
    page: number;
    pageSize?: number;
}
export function getBoardList(params: GetBoardListParmas) {
    return get<{ comments: Comment[]; count: number }>('/api/v1/board/list', params);
}

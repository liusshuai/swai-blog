import { Doc } from '@swai/types';
import { get } from './request';
import { PaginationParams } from './types';

export interface GetDocListParams extends PaginationParams {}
export function getDocList(params: GetDocListParams) {
    return get<{
        page: number;
        total: number;
        list: Doc[];
    }>('/api/v1/admin/doc/getList', params);
}

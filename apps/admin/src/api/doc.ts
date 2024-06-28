import { Doc } from '@swai/types';
import { get } from './request';

export interface GetDocListParams {
    page?: number;
    pageSize?: number;
}
export function getDocList(params: GetDocListParams) {
    return get<{
        page: number;
        total: number;
        list: Doc[];
    }>('/api/v1/admin/doc/getList', params);
}

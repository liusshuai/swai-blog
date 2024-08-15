import { get } from '@/utils/request';

export function getRepoDetail() {
    return get<{
        items_count: number;
        namespace: string;
        user: any;
    }>('/api/v1/repo/getRepoDetail');
}

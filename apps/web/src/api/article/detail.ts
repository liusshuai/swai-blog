import { get } from '@/utils/request';
import { DocDetail } from '@swai/types';

export function getDetail(id: string) {
    return get<DocDetail>('/api/v1/doc/getDetail', { id: Number(id) });
}

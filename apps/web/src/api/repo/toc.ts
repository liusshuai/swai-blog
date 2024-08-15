import { get } from '@/utils/request';
import { Toc } from '@swai/types';

export function getRepoToc() {
    return get<Toc[]>('/api/v1/repo/getToc');
}

import { get } from '@/utils/request';
import { Doc, DocSearchResult } from '@swai/types';

interface SearchArticleParmas {
    keyword: string;
    namespace: string;
}
export function searchArticle(params: SearchArticleParmas) {
    return get<DocSearchResult[]>('/api/v1/doc/search', params);
}

interface GetArticleListParams {
    page: number;
}
export function getArticleList(params: GetArticleListParams) {
    return get<{ list: Doc[]; page: string }>('/api/v1/doc/getList', params);
}

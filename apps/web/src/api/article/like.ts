import { get, post } from '@/utils/request';

export function likeArticle(id: number) {
    return post('/api/v1/doc/like', {
        docId: id,
    });
}

export function unLikeArticle(id: number) {
    return post('/api/v1/doc/unLike', {
        docId: id,
    });
}

export function getTouristLikedArticles() {
    return get<number[]>('/api/v1/tourist/getLikedDocIds');
}

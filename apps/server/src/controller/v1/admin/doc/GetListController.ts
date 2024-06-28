import { Context } from 'koa';
import { AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import yqsdk from '@/utils/yuquesdk';
import { Doc } from '@swai/types';
import { pick } from 'lodash';
import { AppDataSource } from '@/common/database';
import { DocLiked } from '@/entity/DocLIked';
import { CommentRepository } from '@/utils/CommentRepository';
import { CommentType } from '@/entity/ContentComment';

interface GetDocListControllerParams {
    page: number;
    pageSize: number;
}

interface GetDocListControllerResponse {
    page: number;
    list: Doc[];
    total: number;
}

@RouteController()
class GetDocListController implements AsyncRouteController<GetDocListControllerParams, GetDocListControllerResponse> {
    async execute(
        params: GetDocListControllerParams,
        ctx: Context,
    ): Promise<RouteControllerResult<GetDocListControllerResponse>> {
        const { page = 1, pageSize = 10 } = params;

        const book = (await yqsdk.getRepoDetail()).data;
        const data = (await yqsdk.getRepoDocs(page, pageSize)).data;

        const docIds = data.map((item) => item.id);

        const docLikedRepo = AppDataSource.getRepository(DocLiked);
        const likedCounts = await Promise.all(
            docIds.map((id) =>
                docLikedRepo.count({
                    where: { docId: id },
                }),
            ),
        );

        const commentCounts = await Promise.all(
            docIds.map((id) => CommentRepository.getContentCommentCount(CommentType.DOC, id)),
        );

        const result = data.map((doc, i) => {
            doc.likes_count += likedCounts[i] || 0;
            doc.comment_count = commentCounts[i] || 0;

            return pick(doc, [
                'id',
                'slug',
                'title',
                'description',
                'cover',
                'public',
                'status',
                'likes_count',
                'read_count',
                'word_count',
                'comment_count',
                'created_at',
                'updated_at',
            ]);
        });

        return new RouteControllerResult({
            page,
            list: result,
            total: book.items_count,
        });
    }
}

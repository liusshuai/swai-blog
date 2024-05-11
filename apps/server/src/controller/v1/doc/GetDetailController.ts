import { Context } from 'koa';
import { AssertParams, AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import yqsdk from '@/utils/yuquesdk';
import { DocDetail } from '@swai/types';
import { pick } from 'lodash';
import { AppDataSource } from '@/common/database';
import { DocLiked } from '@/entity/DocLIked';
import { CommentRepository } from '@/utils/CommentRepository';
import { CommentType } from '@/entity/ContentComment';

interface GetDocDetailControllerParams {
    id: number;
}

interface GetDocDetailControllerResponse extends DocDetail {}

@RouteController()
class GetDocDetailController
    implements AsyncRouteController<GetDocDetailControllerParams, GetDocDetailControllerResponse>
{
    @AssertParams('id')
    async execute(
        params: GetDocDetailControllerParams,
        ctx: Context,
    ): Promise<RouteControllerResult<GetDocDetailControllerResponse>> {
        const { id } = params;

        const data = (await yqsdk.getDocDetail(id)).data;

        if (data.public !== 1 || data.status !== 1) {
            throw new Error(`Can not find doc by id: ${id}`);
        }

        const docLikedRepo = AppDataSource.getRepository(DocLiked);
        const [likedCount, commentCount] = await Promise.all([
            docLikedRepo.count({
                where: { docId: id }
            }),
            CommentRepository.getContentCommentCount(CommentType.DOC, id),
        ]);

        data.likes_count += likedCount;
        data.comment_count = commentCount;
        const result: any = pick(data, [
            'id',
            'slug',
            'title',
            'description',
            'cover',
            'status',
            'likes_count',
            'read_count',
            'word_count',
            'comment_count',
            'created_at',
            'updated_at',
            'body_html',
        ]);

        result.sourceUrl = `/${data.book.namespace}/${data.slug}`;

        return new RouteControllerResult(result as DocDetail);
    }
}

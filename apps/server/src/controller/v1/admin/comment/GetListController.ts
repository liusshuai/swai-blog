import { Context } from 'koa';
import { AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { AppDataSource } from '@/common/database';
import { ContentComment } from '@/entity/ContentComment';
import { FindOptionsWhere } from 'typeorm';
import { CommentType } from '@swai/types';
import { NeedAdmin } from '@/annotation/NeedAdmin';

interface GetCommentListControllerParams {
    contentId?: number;
    visible?: boolean;
    is_deleted?: boolean;
    type?: CommentType;
    page: number;
    pageSize: number;
}

interface GetCommentListControllerResponse {
    list: ContentComment[];
    total: number;
}

@RouteController()
class GetCommentListController
    implements AsyncRouteController<GetCommentListControllerParams, GetCommentListControllerResponse>
{
    @NeedAdmin()
    async execute(
        params: GetCommentListControllerParams,
        ctx: Context,
    ): Promise<RouteControllerResult<GetCommentListControllerResponse>> {
        const { page = 1, pageSize = 10 } = params;

        const commentRepo = AppDataSource.getRepository(ContentComment);

        const whereFilters: FindOptionsWhere<ContentComment> = {};

        if (params.contentId) {
            whereFilters.contentId = Number(params.contentId);
        }
        if (params.visible !== undefined) {
            whereFilters.visible = params.visible;
        }
        if (params.is_deleted !== undefined) {
            whereFilters.is_deleted = params.is_deleted;
        }
        if (params.type) {
            whereFilters.type = params.type;
        }

        const [list, total] = await commentRepo
            .createQueryBuilder('comment')
            .where(whereFilters)
            .leftJoinAndSelect('comment.from', 'from')
            .loadRelationCountAndMap('comment.replyCount', 'comment.replies')
            .orderBy({
                'comment.create_at': 'DESC',
            })
            .take(pageSize)
            .skip((page - 1) * pageSize)
            .getManyAndCount();

        return new RouteControllerResult({
            list,
            total,
        });
    }
}

import { Context } from 'koa';
import { AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { CommentRepository } from '@/utils/CommentRepository';
import { CommentType } from '@swai/types';
import { ContentComment } from '@/entity/ContentComment';

interface ListControllerParams {
    page?: number;
    pageSize?: number;
}
interface ListControllerResponse {
    comments: ContentComment[];
    count: number;
}
@RouteController()
class ListController implements AsyncRouteController<ListControllerParams, ListControllerResponse> {
    async execute(params: ListControllerParams, ctx: Context): Promise<RouteControllerResult<ListControllerResponse>> {
        const { page = 1, pageSize } = params;

        const res = await CommentRepository.getComments(CommentType.BOADR, {
            page,
            pageSize,
        });

        return new RouteControllerResult(res);
    }
}

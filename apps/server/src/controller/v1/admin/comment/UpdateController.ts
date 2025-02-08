import { Context } from 'koa';
import { AssertParams, AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { AppDataSource } from '@/common/database';
import { ContentComment } from '@/entity/ContentComment';
import { NeedAdmin } from '@/annotation/NeedAdmin';

interface UpdateCommentControllerParams {
    id: number;
    visible?: boolean;
    is_deleted?: boolean;
}

interface UpdateCommentControllerResponse {
    id: number;
    success: boolean;
}

@RouteController()
class UpdateCommentController
    implements AsyncRouteController<UpdateCommentControllerParams, UpdateCommentControllerResponse>
{
    @NeedAdmin()
    @AssertParams('id')
    async execute(
        params: UpdateCommentControllerParams,
        ctx: Context,
    ): Promise<RouteControllerResult<UpdateCommentControllerResponse>> {
        const commentRepo = AppDataSource.getRepository(ContentComment);

        const comment = await commentRepo.findOne({
            where: { id: params.id },
        });

        if (!comment) {
            throw new Error(`can not find comment by id ${params.id}`);
        }

        if (params.is_deleted !== undefined) {
            comment.is_deleted = params.is_deleted;
        }
        if (params.visible !== undefined) {
            comment.visible = params.visible;
        }
        await commentRepo.save(comment);

        return new RouteControllerResult({
            id: comment.id,
            success: true,
        });
    }
}

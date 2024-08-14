import { Context } from 'koa';
import { AssertParams, AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { CommentReply } from '@/entity/CommentReply';
import { AppDataSource } from '@/common/database';
import { NeedAdmin } from '@/annotation/NeedAdmin';

interface GetRepliesControllerParams {
    comment_id: number;
    page: number;
    pageSize: number;
}

interface GetRepliesControllerResult {
    replies: CommentReply[];
    count: number;
}

@RouteController()
class GetRepliesController implements AsyncRouteController<GetRepliesControllerParams, GetRepliesControllerResult> {
    @NeedAdmin()
    @AssertParams('comment_id')
    async execute(
        params: GetRepliesControllerParams,
        ctx: Context,
    ): Promise<RouteControllerResult<GetRepliesControllerResult>> {
        const { page = 1, pageSize = 5, comment_id } = params;

        const replyRepo = AppDataSource.getRepository(CommentReply);

        const [replies, count] = await replyRepo
            .createQueryBuilder('reply')
            .where('reply.comment_id = :commentId', { commentId: comment_id })
            .leftJoinAndSelect('reply.from', 'from')
            .leftJoinAndSelect('reply.to', 'to')
            .orderBy('reply.create_at', 'DESC')
            .take(pageSize)
            .skip((page - 1) * pageSize)
            .getManyAndCount();

        return new RouteControllerResult({
            replies,
            count,
        });
    }
}

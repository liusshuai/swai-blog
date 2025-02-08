import { Context } from 'koa';
import { AssertParams, AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { AppDataSource } from '@/common/database';
import { NeedAdmin } from '@/annotation/NeedAdmin';
import { CommentReply } from '@/entity/CommentReply';

interface RemoveReplyControllerParams {
    id: number;
}

@RouteController()
class RemoveReplyController implements AsyncRouteController<RemoveReplyControllerParams, true> {
    @NeedAdmin()
    @AssertParams('id')
    async execute(params: RemoveReplyControllerParams, ctx: Context): Promise<RouteControllerResult<true>> {
        const replyRepo = AppDataSource.getRepository(CommentReply);

        const reply = await replyRepo.findOne({
            where: { id: params.id },
        });

        if (!reply) {
            throw new Error(`can not find reply by id ${params.id}`);
        }

        reply.is_deleted = true;
        reply.visible = false;

        await replyRepo.save(reply);

        return new RouteControllerResult(true);
    }
}

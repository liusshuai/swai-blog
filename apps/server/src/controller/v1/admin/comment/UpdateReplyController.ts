import { Context } from 'koa';
import { AssertParams, AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { AppDataSource } from '@/common/database';
import { NeedAdmin } from '@/annotation/NeedAdmin';
import { CommentReply } from '@/entity/CommentReply';

interface UpdateReplyControllerParams {
    id: number;
    visible?: boolean;
    is_deleted?: boolean;
}

@RouteController({
    methods: 'post',
})
class UpdateReplyController implements AsyncRouteController<UpdateReplyControllerParams, true> {
    @NeedAdmin()
    @AssertParams('id')
    async execute(params: UpdateReplyControllerParams, ctx: Context): Promise<RouteControllerResult<true>> {
        const replyRepo = AppDataSource.getRepository(CommentReply);

        const reply = await replyRepo.findOne({
            where: { id: params.id },
        });

        if (!reply) {
            throw new Error(`can not find reply by id ${params.id}`);
        }

        if (params.is_deleted !== undefined) {
            reply.is_deleted = params.is_deleted;
            reply.visible = !params.is_deleted;
        }

        if (params.visible !== undefined) {
            reply.visible = params.visible;
        }

        await replyRepo.save(reply);

        return new RouteControllerResult(true);
    }
}

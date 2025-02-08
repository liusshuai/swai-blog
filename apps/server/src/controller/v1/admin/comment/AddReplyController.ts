import { Context } from 'koa';
import { AssertParams, AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { TOURIST_UUID_KEY } from '@/common/constant';
import { CommentRepository } from '@/utils/CommentRepository';
import { CommentReply } from '@/entity/CommentReply';
import { NeedAdmin } from '@/annotation/NeedAdmin';

interface AddReplyControllerParams {
    comment_id: number;
    content: string;
    to: string;
}

@RouteController({
    methods: 'post',
})
class AddReplyController implements AsyncRouteController<AddReplyControllerParams, CommentReply> {
    @NeedAdmin()
    @AssertParams('comment_id', 'content', 'to')
    async execute(params: AddReplyControllerParams, ctx: Context): Promise<RouteControllerResult<CommentReply>> {
        const { comment_id, content, to } = params;

        const vuid = ctx.cookies.get(TOURIST_UUID_KEY)!;

        const reply = await CommentRepository.addReply(comment_id, {
            from: vuid,
            to: to,
            content,
        });

        return new RouteControllerResult(reply);
    }
}

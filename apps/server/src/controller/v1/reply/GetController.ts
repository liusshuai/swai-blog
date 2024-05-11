import { Context } from 'koa';
import { AssertParams, AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { CommentRepository } from '@/utils/CommentRepository';
import { CommentReply } from '@/entity/CommentReply';

interface GetControllerParams {
    comment_id: number;
}

interface GetControllerResult {
    replies: CommentReply[];
    count: number;
}

@RouteController()
class GetController implements AsyncRouteController<GetControllerParams, GetControllerResult> {
    @AssertParams('comment_id')
    async execute(params: GetControllerParams, ctx: Context): Promise<RouteControllerResult<GetControllerResult>> {
        const { comment_id } = params;

        const [replies, count] = await CommentRepository.getReplies(comment_id);
        
        return new RouteControllerResult({
            replies,
            count
        });
    }
}

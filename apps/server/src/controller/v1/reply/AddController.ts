import { Context } from 'koa';
import { AssertParams, AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { TOURIST_UUID_KEY } from '@/common/constant';
import { TouristLogin } from '@/utils/TouristLogin';
import { CommentRepository } from '@/utils/CommentRepository';
import { CommentReply } from '@/entity/CommentReply';

interface AddControllerParams {
    comment_id: number;
    content: string;
    to: string;
}

@RouteController({
    methods: 'post'
})
class AddController implements AsyncRouteController<AddControllerParams, CommentReply> {
    @AssertParams('comment_id', 'content', 'to')
    @TouristLogin()
    async execute(params: AddControllerParams, ctx: Context): Promise<RouteControllerResult<CommentReply>> {
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

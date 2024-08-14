import { Context } from 'koa';
import { AssertParams, AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { TOURIST_UUID_KEY } from '@/common/constant';
import { TouristLogin } from '@/annotation/TouristLogin';
import { CommentRepository } from '@/utils/CommentRepository';

interface RemoveControllerParams {
    comment_id: number;
}

@RouteController({
    methods: 'post',
})
class RemoveController implements AsyncRouteController<RemoveControllerParams, boolean> {
    @AssertParams('comment_id')
    @TouristLogin()
    async execute(params: RemoveControllerParams, ctx: Context): Promise<RouteControllerResult<boolean>> {
        const { comment_id } = params;

        const vuid = ctx.cookies.get(TOURIST_UUID_KEY)!;

        await CommentRepository.removeComment(comment_id, vuid);

        return new RouteControllerResult(true);
    }
}

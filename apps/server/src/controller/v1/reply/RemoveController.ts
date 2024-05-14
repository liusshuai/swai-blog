import { Context } from 'koa';
import { AssertParams, AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { TOURIST_UUID_KEY } from '@/common/constant';
import { TouristLogin } from '@/utils/TouristLogin';
import { CommentRepository } from '@/utils/CommentRepository';

interface RemoveControllerParams {
    reply_id: number;
}

@RouteController({
    methods: 'post',
})
class RemoveController implements AsyncRouteController<RemoveControllerParams, boolean> {
    @AssertParams('reply_id')
    @TouristLogin()
    async execute(params: RemoveControllerParams, ctx: Context): Promise<RouteControllerResult<boolean>> {
        const { reply_id } = params;

        const vuid = ctx.cookies.get(TOURIST_UUID_KEY)!;

        await CommentRepository.removeReply(reply_id, vuid);

        return new RouteControllerResult(true);
    }
}

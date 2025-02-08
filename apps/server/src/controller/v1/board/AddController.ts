import { Context } from 'koa';
import { AssertParams, AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { TOURIST_UUID_KEY } from '@/common/constant';
import { TouristLogin } from '@/annotation/TouristLogin';
import { CommentType } from '@swai/types';
import { CommentRepository } from '@/utils/CommentRepository';
import { ContentComment } from '@/entity/ContentComment';

interface AddControllerParams {
    content: string;
}

@RouteController({
    methods: 'post',
})
class AddController implements AsyncRouteController<AddControllerParams, ContentComment> {
    @AssertParams('content')
    @TouristLogin()
    async execute(params: AddControllerParams, ctx: Context): Promise<RouteControllerResult<ContentComment>> {
        const { content } = params;

        const uid = ctx.cookies.get(TOURIST_UUID_KEY)!;

        const comment = await CommentRepository.addComment(CommentType.BOADR, {
            fromId: uid,
            content,
        });

        return new RouteControllerResult(comment);
    }
}

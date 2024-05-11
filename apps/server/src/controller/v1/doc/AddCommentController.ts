import { Context } from 'koa';
import { AssertParams, AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { TOURIST_UUID_KEY } from '@/common/constant';
import { TouristLogin } from '@/utils/TouristLogin';
import { CommentType } from '@/entity/ContentComment';
import { CommentRepository } from '@/utils/CommentRepository';

interface AddCommentControllerParams {
    docId: number;
    content: string;
}

@RouteController({
    methods: 'post'
})
class AddCommentController implements AsyncRouteController<AddCommentControllerParams, boolean> {
    @AssertParams('docId', 'content')
    @TouristLogin()
    async execute(params: AddCommentControllerParams, ctx: Context): Promise<RouteControllerResult<boolean>> {
        const { docId, content } = params;

        const vuid = ctx.cookies.get(TOURIST_UUID_KEY)!;

        await CommentRepository.addComment(CommentType.DOC, {
            fromId: vuid,
            contentId: docId,
            content,
        });
        

        return new RouteControllerResult(true);
    }
}

import { Context } from 'koa';
import { AssertParams, AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { CommentType } from '@/entity/ContentComment';
import { CommentRepository } from '@/utils/CommentRepository';
import { Comment } from '@swai/types';

interface AddCommentControllerParams {
    docId: number;
    page?: number;
    pageSize?: number;
}

@RouteController()
class AddCommentController implements AsyncRouteController<AddCommentControllerParams, Comment[]> {
    @AssertParams('docId')
    async execute(params: AddCommentControllerParams, ctx: Context): Promise<RouteControllerResult<Comment[]>> {
        const { docId, page = 1, pageSize } = params;

        const comments = await CommentRepository.getComments(CommentType.DOC, {
            contentId: docId,
            page,
            pageSize,
        }) as unknown as Comment[];
        

        return new RouteControllerResult(comments);
    }
}

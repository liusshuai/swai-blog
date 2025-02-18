import { Context } from 'koa';
import { AssertParams, AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { CommentRepository } from '@/utils/CommentRepository';
import { Comment, CommentType } from '@swai/types';

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

        const { comments } = (await CommentRepository.getComments(CommentType.DOC, {
            contentId: docId,
            page,
            pageSize,
        })) as unknown as { comments: Comment[]; count: number };

        return new RouteControllerResult(comments);
    }
}

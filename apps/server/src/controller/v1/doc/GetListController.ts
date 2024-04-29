import { Context } from 'koa';
import { AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import yqsdk from '@/utils/yuquesdk';
import { Doc } from '@swai/types';
import { pick } from 'lodash';

interface GetDocListControllerParams {
    page: number;
    pageSize: number;
}

interface GetDocListControllerResponse {
    page: number;
    list: Doc[];
}

@RouteController()
class GetDocListController implements AsyncRouteController<GetDocListControllerParams, GetDocListControllerResponse> {
    async execute(
        params: GetDocListControllerParams,
        ctx: Context,
    ): Promise<RouteControllerResult<GetDocListControllerResponse>> {
        const { page = 1, pageSize = 10 } = params;

        const data = (await yqsdk.getRepoDocs(page, pageSize)).data;

        return new RouteControllerResult({
            page,
            list: data
                .filter((doc) => doc.status === 1 && doc.public === 1)
                .map((doc) =>
                    pick(doc, [
                        'id',
                        'slug',
                        'title',
                        'description',
                        'cover',
                        'public',
                        'status',
                        'likes_count',
                        'read_count',
                        'word_count',
                        'created_at',
                        'updated_at',
                    ]),
                ),
        });
    }
}

import { Context } from 'koa';
import { AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import yqsdk from '@/utils/yuquesdk';
import { pick } from 'lodash';
import { Toc } from '@swai/types';

@RouteController()
class GetRepoTocController implements AsyncRouteController<void, Toc[]> {
    async execute(params: void, ctx: Context): Promise<RouteControllerResult<Toc[]>> {
        const data = (await yqsdk.getRepoToc()).data;

        return new RouteControllerResult(
            data.map((row) => pick(row, ['uuid', 'type', 'title', 'id', 'parent_uuid', 'child_uuid'])),
        );
    }
}

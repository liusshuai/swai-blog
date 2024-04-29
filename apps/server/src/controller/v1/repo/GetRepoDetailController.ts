import { Context } from 'koa';
import { AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import yqsdk from '@/utils/yuquesdk';
import { pick } from 'lodash';
import { V2BookDetail } from '@/types/YuQueSerializer/BookDetail';

@RouteController()
class GetRepoDetailController
    implements AsyncRouteController<void, Pick<V2BookDetail, 'items_count' | 'namespace' | 'user'>>
{
    async execute(params: void, ctx: Context): Promise<any> {
        const data = (await yqsdk.getRepoDetail()).data;

        if (data.public === 0) {
            throw new Error('Current Repo can not visited');
        }

        return new RouteControllerResult(pick(data, ['items_count', 'namespace', 'user']));
    }
}

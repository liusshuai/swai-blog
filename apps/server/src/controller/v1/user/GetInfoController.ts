import { Context } from 'koa';
import type { UserInfo } from '@swai/types';
import { AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import yqsdk from '@/utils/yuquesdk';

@RouteController()
class GetUserInfoController implements AsyncRouteController<void, UserInfo> {
    async execute(params: void, ctx: Context): Promise<RouteControllerResult<UserInfo>> {
        const res = (await yqsdk.getRepoDetail()).data;

        const info = res.user;

        return new RouteControllerResult({
            nickname: info.name,
            avatar: info.avatar_url,
            slogan: info.description,
            follower: info.followers_count,
            docCount: res.items_count,
            boardCount: 0,
        });
    }
}

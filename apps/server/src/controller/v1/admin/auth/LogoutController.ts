import { NeedAdmin } from '@/annotation/NeedAdmin';
import { setTouristCookies } from '@/utils/cookies';
import { AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { Context } from 'koa';

@RouteController({
    methods: 'post',
})
class LogoutController implements AsyncRouteController<void, true> {
    @NeedAdmin()
    async execute(_params: void, ctx: Context): Promise<RouteControllerResult<true>> {
        delete ctx.session!.UUID;
        delete ctx.session!.ADMIN_UUID;
        delete ctx.session!.LAST_VISITE_TOKEN;
        setTouristCookies(ctx, null);

        return new RouteControllerResult(true);
    }
}

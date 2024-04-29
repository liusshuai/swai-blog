import { Context } from 'koa';
import { AsyncRouteController, RouteController, RouteControllerResult } from '../../../../src';

@RouteController()
class DefaultTimeoutController implements AsyncRouteController<any, any> {
    async execute(params: any, ctx: Context): Promise<RouteControllerResult<any>> {
        await (() =>
            new Promise((resolve) => {
                setTimeout(resolve, 1500);
            }))();

        return new RouteControllerResult(null);
    }
}

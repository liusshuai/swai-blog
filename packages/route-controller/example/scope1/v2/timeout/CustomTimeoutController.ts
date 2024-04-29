import { Context } from 'koa';
import { AsyncRouteController, RouteController, RouteControllerResult } from '../../../../src';

interface CustomTimeoutControllerParams {
    timeout: number;
}

@RouteController({ timeout: 1500 })
class CustomTimeoutController implements AsyncRouteController<CustomTimeoutControllerParams, string> {
    async execute(params: CustomTimeoutControllerParams, ctx: Context): Promise<RouteControllerResult<string>> {
        await (() =>
            new Promise((resolve) => {
                setTimeout(resolve, params.timeout || 1000);
            }))();

        return new RouteControllerResult('hello');
    }
}

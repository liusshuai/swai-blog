import { Context } from 'koa';
import { RouteController, RouteControllerResult, type SyncRouteController } from '../../../src';

interface TestControllerParams {
    [key: string]: any;
}

interface TestControllerResponse extends TestControllerParams {
    isRes: true;
}

@RouteController()
class TestController implements SyncRouteController<TestControllerParams, TestControllerResponse> {
    execute(params: TestControllerParams, ctx: Context): RouteControllerResult<TestControllerResponse> {
        return new RouteControllerResult({
            ...(params || {}),
            isRes: true,
        });
    }
}

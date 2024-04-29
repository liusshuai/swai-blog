import { Context } from 'koa';
import { AssertParams, RouteController, RouteControllerResult, type SyncRouteController } from '../../../../src';

interface CheckPermissionControllerParams {
    name: string;
}

@RouteController({ methods: 'post' })
class CheckPermissionController implements SyncRouteController<CheckPermissionControllerParams, boolean> {
    @AssertParams('name')
    execute(params: CheckPermissionControllerParams, ctx: Context): RouteControllerResult<boolean> {
        return new RouteControllerResult(params.name === 'lsshuai');
    }
}

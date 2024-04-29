import { Context } from 'koa';
import { AssertParams, RouteController, RouteControllerResult, type SyncRouteController } from '../../../../src';

interface GetUserInfoControllerParams {
    id: number;
}

interface GetUserInfoControllerResult {
    name: string;
    age: number;
    sex: 'male' | 'female';
}

@RouteController()
class GetUserInfoController implements SyncRouteController<GetUserInfoControllerParams, GetUserInfoControllerResult> {
    @AssertParams('id')
    execute(params: GetUserInfoControllerParams, ctx: Context): RouteControllerResult<GetUserInfoControllerResult> {
        return new RouteControllerResult({
            name: 'lsshuai',
            age: 28,
            sex: 'male',
        });
    }
}

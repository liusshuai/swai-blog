import { Context } from 'koa';
import { AssertParams, AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { AppDataSource } from '@/common/database';
import { Tourist } from '@/entity/Tourist';
import { NeedAdmin } from '@/annotation/NeedAdmin';

interface ChangeStateControllerParams {
    id: number;
    un_followed?: boolean;
    is_black?: boolean;
}

interface ChangeStateControllerResponse {
    id: number;
    success: boolean;
}

@RouteController()
class ChangeStateController
    implements AsyncRouteController<ChangeStateControllerParams, ChangeStateControllerResponse>
{
    @NeedAdmin()
    @AssertParams('id')
    async execute(
        params: ChangeStateControllerParams,
        ctx: Context,
    ): Promise<RouteControllerResult<ChangeStateControllerResponse>> {
        const touristRepo = AppDataSource.getRepository(Tourist);

        const tourist = await touristRepo.findOneBy({
            id: params.id,
        });

        if (!tourist) {
            throw new Error('can not find tourist by id: ' + params.id);
        }

        if (params.is_black !== undefined) {
            tourist.is_black = params.is_black;
        }

        if (params.un_followed !== undefined) {
            tourist.un_followed = params.un_followed;
        }

        await touristRepo.save(tourist);

        return new RouteControllerResult({
            id: tourist.id,
            success: true,
        });
    }
}

import { Context } from 'koa';
import { AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { AppDataSource } from '@/common/database';
import { Tourist } from '@/entity/Tourist';
import { TOURIST_UUID_KEY } from '@/common/constant';

@RouteController()
class GetTouristInfoController implements AsyncRouteController<void, Tourist | null> {
    async execute(params: void, ctx: Context): Promise<RouteControllerResult<Tourist | null>> {
        const uuid = ctx.cookies.get(TOURIST_UUID_KEY);
        if (uuid) {
            const touristRepo = AppDataSource.getRepository(Tourist);
            const tourist = await touristRepo.findOneBy({
                uuid,
            });

            if (tourist) {
                return new RouteControllerResult(tourist);
            }
        }

        return new RouteControllerResult(null);
    }
}

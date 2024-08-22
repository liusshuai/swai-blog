import { Context } from 'koa';
import type { TouristProfile } from '@swai/types';
import { AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { AppDataSource } from '@/common/database';
import { Tourist } from '@/entity/Tourist';
import { TOURIST_UUID_KEY } from '@/common/constant';

@RouteController()
class GetTouristInfoController implements AsyncRouteController<void, TouristProfile | null> {
    async execute(params: void, ctx: Context): Promise<RouteControllerResult<TouristProfile | null>> {
        const uuid = ctx.cookies.get(TOURIST_UUID_KEY);
        if (uuid) {
            const touristRepo = AppDataSource.getRepository(Tourist);
            const visitor = await touristRepo.findOneBy({
                uuid,
            });

            if (visitor) {
                return new RouteControllerResult(visitor);
            }
        }

        return new RouteControllerResult(null);
    }
}

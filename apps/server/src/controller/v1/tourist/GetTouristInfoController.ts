import { Context } from 'koa';
import type { TouristProfile } from '@swai/types';
import { AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { AppDataSource } from '@/common/database';
import { Tourist } from '@/entity/Tourist';
import { TOURIST_LAST_VISIT_TOKEN_KEY, TOURIST_UUID_KEY } from '@/common/constant';

@RouteController()
class GetTouristInfoController implements AsyncRouteController<void, TouristProfile | null> {
    async execute(params: void, ctx: Context): Promise<RouteControllerResult<TouristProfile | null>> {
        
        const visitorId = ctx.cookies.get(TOURIST_UUID_KEY);
        const lastVisitToken = ctx.cookies.get(TOURIST_LAST_VISIT_TOKEN_KEY);
        if (visitorId && lastVisitToken) {
            const touristRepo = AppDataSource.getRepository(Tourist);
            const visitor = await touristRepo.findOneBy({
                id: visitorId,
                last_visit_token: lastVisitToken,
            });

            if (visitor) {
                return new RouteControllerResult(visitor);
            }
        }

        return new RouteControllerResult(null);
    }
}
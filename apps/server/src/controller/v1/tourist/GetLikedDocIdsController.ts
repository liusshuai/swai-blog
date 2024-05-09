import { Context } from 'koa';
import { AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { AppDataSource } from '@/common/database';
import { Tourist } from '@/entity/Tourist';
import { TOURIST_UUID_KEY } from '@/common/constant';
import { DocLiked } from '@/entity/DocLIked';

@RouteController()
class GetTouristLikedDocIdsController implements AsyncRouteController<void, number[]> {
    async execute(params: void, ctx: Context): Promise<RouteControllerResult<number[]>> {
        
        const touristId = ctx.cookies.get(TOURIST_UUID_KEY);
        if (touristId) {
            const touristRepo = AppDataSource.getRepository(Tourist);
            const visitor = await touristRepo.findOneBy({
                id: touristId,
            });

            if (visitor) {
                const docLikedRepo = AppDataSource.getRepository(DocLiked);
                const records = await docLikedRepo.find({
                    where: {
                        vuid: visitor.id,
                    }
                });
                return new RouteControllerResult(records.map(record => record.docId));
            }
        }

        return new RouteControllerResult([]);
    }
}

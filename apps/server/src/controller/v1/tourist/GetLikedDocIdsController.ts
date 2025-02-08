import { Context } from 'koa';
import { AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { AppDataSource } from '@/common/database';
import { Tourist } from '@/entity/Tourist';
import { TOURIST_UUID_KEY } from '@/common/constant';
import { DocLiked } from '@/entity/DocLIked';

@RouteController()
class GetTouristLikedDocIdsController implements AsyncRouteController<void, number[]> {
    async execute(params: void, ctx: Context): Promise<RouteControllerResult<number[]>> {
        const touristUUID = ctx.cookies.get(TOURIST_UUID_KEY);
        if (touristUUID) {
            const touristRepo = AppDataSource.getRepository(Tourist);
            const visitor = await touristRepo.findOneBy({
                uuid: touristUUID,
            });

            if (visitor) {
                const docLikedRepo = AppDataSource.getRepository(DocLiked);
                const records = await docLikedRepo.find({
                    where: {
                        vuid: visitor.uuid,
                    },
                });
                return new RouteControllerResult(records.map((record) => record.docId));
            }
        }

        return new RouteControllerResult([]);
    }
}

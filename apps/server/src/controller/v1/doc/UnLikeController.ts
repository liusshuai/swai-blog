import { Context } from 'koa';
import { AssertParams, AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { AppDataSource } from '@/common/database';
import { DocLiked } from '@/entity/DocLIked';
import { TOURIST_UUID_KEY } from '@/common/constant';
import { TouristLogin } from '@/annotation/TouristLogin';

interface UnLikeControllerParams {
    docId: number;
}

@RouteController()
class UnLikeController implements AsyncRouteController<UnLikeControllerParams, boolean> {
    @AssertParams('docId')
    @TouristLogin()
    async execute(params: UnLikeControllerParams, ctx: Context): Promise<RouteControllerResult<boolean>> {
        const { docId } = params;

        const vuid = ctx.cookies.get(TOURIST_UUID_KEY);

        const docLikedRepo = AppDataSource.getRepository(DocLiked);
        const row = await docLikedRepo.findOneBy({
            docId,
            vuid,
        });

        if (row) {
            await docLikedRepo.remove(row);
        }

        return new RouteControllerResult(true);
    }
}

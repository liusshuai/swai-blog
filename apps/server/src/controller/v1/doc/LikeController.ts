import { Context } from 'koa';
import { AssertParams, AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { AppDataSource } from '@/common/database';
import { DocLiked } from '@/entity/DocLIked';
import { TOURIST_UUID_KEY } from '@/common/constant';
import { TouristLogin } from '@/utils/TouristLogin';

interface LikeControllerParams {
    docId: number;
}

@RouteController()
class LikeController implements AsyncRouteController<LikeControllerParams, boolean> {
    @AssertParams('docId')
    @TouristLogin()
    async execute(params: LikeControllerParams, ctx: Context): Promise<RouteControllerResult<boolean>> {
        const { docId } = params;

        const vuid = ctx.cookies.get(TOURIST_UUID_KEY);

        const docLikedRepo = AppDataSource.getRepository(DocLiked);
        const row = await docLikedRepo.findOneBy({
            docId,
            vuid,
        });

        if (!row) {
            const record = new DocLiked();
            record.docId = docId;
            record.vuid = vuid!;
            await docLikedRepo.save(record);
        }

        return new RouteControllerResult(true);
    }
}

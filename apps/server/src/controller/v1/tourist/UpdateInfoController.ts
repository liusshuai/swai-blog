import { Context } from 'koa';
import { AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { AppDataSource } from '@/common/database';
import { Tourist } from '@/entity/Tourist';
import { TOURIST_UUID_KEY } from '@/common/constant';
import { checkEmailCode } from '@/utils/checkEmailCode';
import { TouristLogin } from '@/annotation/TouristLogin';

interface UpdateInfoControllerParams {
    email: string;
    nickname: string;
    website?: string;
    verifyCode: string;
    avatar_style: string;
    avatar_search?: string;
}

@RouteController({
    methods: 'post',
})
class UpdateInfoController implements AsyncRouteController<UpdateInfoControllerParams, Tourist> {
    @TouristLogin()
    async execute(params: UpdateInfoControllerParams, ctx: Context): Promise<RouteControllerResult<Tourist>> {
        checkEmailCode(ctx, { email: params.email, code: params.verifyCode });
        ctx.session!.emailVerify = null;

        const uuid = ctx.cookies.get(TOURIST_UUID_KEY);
        const touristRepo = AppDataSource.getRepository(Tourist);
        const tourist = await touristRepo.findOneBy({
            uuid,
            email: params.email,
        });

        if (!tourist) {
            throw new Error('该用户未定订阅');
        }

        tourist.nickname = params.nickname;
        tourist.website = params.website || '';
        tourist.avatar_style = params.avatar_style;
        tourist.avatar_search = params.avatar_search || '';

        await touristRepo.save(tourist);

        return new RouteControllerResult(tourist);
    }
}

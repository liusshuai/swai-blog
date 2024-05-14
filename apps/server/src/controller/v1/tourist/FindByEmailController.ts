import { Context } from 'koa';
import type { TouristProfile } from '@swai/types';
import { AssertParams, AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { AppDataSource } from '@/common/database';
import { Tourist } from '@/entity/Tourist';
import { TOURIST_LAST_VISIT_TOKEN_KEY, TOURIST_UUID_KEY } from '@/common/constant';
import { createToken } from '@/utils/cryptoToken';

interface FindByEmailControllerParams {
    email: string;
    verifyCode: string;
}

@RouteController({
    methods: 'post',
})
class FindByEmailController implements AsyncRouteController<FindByEmailControllerParams, TouristProfile | null> {
    @AssertParams('email', 'verifyCode')
    async execute(
        params: FindByEmailControllerParams,
        ctx: Context,
    ): Promise<RouteControllerResult<TouristProfile | null>> {
        if (params.verifyCode !== '1234') {
            throw new Error('邮箱验证码已过期或错误，请稍后重试');
        }

        const touristRepo = AppDataSource.getRepository(Tourist);
        const tourist = await touristRepo.findOneBy({
            email: params.email,
        });

        if (!tourist) {
            throw new Error('该邮箱并未留存');
        }

        tourist.last_visit_token = createToken();
        await touristRepo.save(tourist);

        ctx.cookies.set(TOURIST_UUID_KEY, tourist.id, {
            httpOnly: true,
            // secure: true, // if https
        });
        ctx.cookies.set(TOURIST_LAST_VISIT_TOKEN_KEY, tourist.last_visit_token, {
            httpOnly: true,
            // secure: true, // if https
        });

        return new RouteControllerResult(tourist);
    }
}

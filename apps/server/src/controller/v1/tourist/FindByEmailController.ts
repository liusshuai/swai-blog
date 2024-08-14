import { Context } from 'koa';
import type { TouristProfile } from '@swai/types';
import { AssertParams, AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { AppDataSource } from '@/common/database';
import { Tourist } from '@/entity/Tourist';
import { setTouristCookies } from '@/utils/cookies';

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

        await touristRepo.save(tourist);

        setTouristCookies(ctx, tourist.id);

        return new RouteControllerResult(tourist);
    }
}

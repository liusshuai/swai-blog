import { Context } from 'koa';
import { AssertParams, AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { AppDataSource } from '@/common/database';
import { Tourist } from '@/entity/Tourist';
import { setTouristCookies } from '@/utils/cookies';
import { checkEmailCode } from '@/utils/checkEmailCode';

interface FindByEmailControllerParams {
    email: string;
    verifyCode: string;
}

@RouteController({
    methods: 'post',
})
class FindByEmailController implements AsyncRouteController<FindByEmailControllerParams, Tourist | null> {
    @AssertParams('email', 'verifyCode')
    async execute(params: FindByEmailControllerParams, ctx: Context): Promise<RouteControllerResult<Tourist | null>> {
        checkEmailCode(ctx, { email: params.email, code: params.verifyCode });
        ctx.session!.emailVerify = null;

        const touristRepo = AppDataSource.getRepository(Tourist);
        const tourist = await touristRepo.findOneBy({
            email: params.email,
        });

        if (!tourist) {
            throw new Error('该邮箱并未留存');
        }

        await touristRepo.save(tourist);

        ctx.session!.UUID = tourist.uuid;
        setTouristCookies(ctx, tourist.uuid);

        return new RouteControllerResult(tourist);
    }
}

import { AppDataSource } from '@/common/database';
import { Tourist } from '@/entity/Tourist';
import { checkEmailCode } from '@/utils/checkEmailCode';
import { setTouristCookies } from '@/utils/cookies';
import { AssertParams, AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { Context } from 'koa';

interface LoginControllerParams {
    email: string;
    code: string;
}

@RouteController({
    methods: 'post',
})
class LoginController implements AsyncRouteController<LoginControllerParams, true> {
    @AssertParams('email', 'code')
    async execute(params: LoginControllerParams, ctx: Context): Promise<RouteControllerResult<true>> {
        checkEmailCode(ctx, params);

        ctx.session!.emailVerify = null;

        const touristRepo = AppDataSource.getRepository(Tourist);
        let tourist = await touristRepo.findOneBy({
            email: params.email,
        });
        if (!tourist) {
            tourist = new Tourist();
            tourist.email = params.email;
            tourist.nickname = 'LSSHUAISL(Admin)';
            tourist.website = 'https://www.lsshuaisl.com';
            tourist.avatar_style = '';
            tourist.avatar_search = '';

            await touristRepo.save(tourist);
        }

        ctx.session!.UUID = tourist.id;
        ctx.session!.ADMIN_UUID = tourist.id;
        setTouristCookies(ctx, tourist.id);

        return new RouteControllerResult(true);
    }
}

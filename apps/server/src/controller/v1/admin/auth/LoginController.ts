import { AppDataSource } from '@/common/database';
import { Tourist } from '@/entity/Tourist';
import { checkEmailCode } from '@/utils/checkEmailCode';
import { setTouristCookies } from '@/utils/cookies';
import { AssertParams, AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { Context } from 'koa';
import config from '@/common/serverConfig';

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

        const admin = config.get('admin');

        ctx.session!.emailVerify = null;

        if (params.email !== admin.email) {
            throw new Error('Not an administrator account');
        }
        const touristRepo = AppDataSource.getRepository(Tourist);
        let tourist = await touristRepo.findOneBy({
            email: params.email,
        });
        if (!tourist) {
            tourist = new Tourist();
            tourist.email = params.email;
            tourist.nickname = admin.nickname || 'LSSHUAISL(Admin)';
            tourist.website = 'https://www.lsshuaisl.com';
            tourist.avatar_style = '';
            tourist.avatar_search = '';

            await touristRepo.save(tourist);
        }

        ctx.session!.UUID = tourist.uuid;
        ctx.session!.ADMIN_UUID = tourist.uuid;
        setTouristCookies(ctx, tourist.uuid);

        return new RouteControllerResult(true);
    }
}

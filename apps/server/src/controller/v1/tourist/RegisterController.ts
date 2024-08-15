import { Context } from 'koa';
import type { TouristProfile } from '@swai/types';
import { AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { AppDataSource } from '@/common/database';
import { Tourist } from '@/entity/Tourist';
import { setTouristCookies } from '@/utils/cookies';
import { checkEmailCode } from '@/utils/checkEmailCode';

interface RegisterControllerParams {
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
class RegisterController implements AsyncRouteController<RegisterControllerParams, TouristProfile> {
    async execute(params: RegisterControllerParams, ctx: Context): Promise<RouteControllerResult<TouristProfile>> {
        checkEmailCode(ctx, { email: params.email, code: params.verifyCode });
        ctx.session!.emailVerify = null;

        const touristRepo = AppDataSource.getRepository(Tourist);
        const tourist = await touristRepo.findOneBy({
            email: params.email,
        });

        if (tourist) {
            throw new Error('当前邮箱已被使用');
        }

        const newTourist = new Tourist();
        newTourist.email = params.email;
        newTourist.nickname = params.nickname;
        newTourist.website = params.website || '';
        newTourist.avatar_style = params.avatar_style;
        newTourist.avatar_search = params.avatar_search || '';

        await touristRepo.save(newTourist);

        setTouristCookies(ctx, newTourist.id);

        return new RouteControllerResult(newTourist);
    }
}

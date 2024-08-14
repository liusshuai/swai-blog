import { Context } from 'koa';
import type { TouristProfile } from '@swai/types';
import { AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { AppDataSource } from '@/common/database';
import { Tourist } from '@/entity/Tourist';
import { TOURIST_UUID_KEY } from '@/common/constant';
import { setTouristCookies } from '@/utils/cookies';

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
        if (params.verifyCode !== '1234') {
            throw new Error('邮箱验证码已过期或错误，请稍后重试');
        }

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

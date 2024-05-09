import { Context } from 'koa';
import type { TouristProfile } from '@swai/types';
import { AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { AppDataSource } from '@/common/database';
import { Tourist } from '@/entity/Tourist';
import { TOURIST_LAST_VISIT_TOKEN_KEY, TOURIST_UUID_KEY } from '@/common/constant';
import { omit } from 'lodash';
import { createToken } from '@/utils/cryptoToken';

interface RegisterControllerParams {
    email: string;
    nickname: string;
    website?: string;
    verifyCode: string;
    avatar_style: string;
    avatar_search?: string;
}

@RouteController({
    methods: 'post'
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
        newTourist.last_visit_token = createToken();

        await touristRepo.save(newTourist);

        ctx.cookies.set(TOURIST_UUID_KEY, newTourist.id, {
            httpOnly: true,
            // secure: true, // if https
        });
        ctx.cookies.set(TOURIST_LAST_VISIT_TOKEN_KEY, newTourist.last_visit_token, {
            httpOnly: true,
            // secure: true, // if https
        })

        return new RouteControllerResult(omit(newTourist, ['last_visit_token']));
    }
}

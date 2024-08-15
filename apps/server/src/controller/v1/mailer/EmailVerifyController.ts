import { mailerQueue } from '@/queue/mailerQueue';
import { getRandomByte } from '@/utils/cryptoToken';
import { AssertParams, AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { Context } from 'koa';

interface EmailVerifyParams {
    code: string;
    email: string;
}

@RouteController()
class EmailVerifyController implements AsyncRouteController<EmailVerifyParams, true> {
    @AssertParams('email', 'code')
    async execute(params: EmailVerifyParams, ctx: Context): Promise<RouteControllerResult<true>> {
        if (params.code.toLowerCase() !== ctx.session!.captcha) {
            throw new Error('验证码错误');
        }

        const code = getRandomByte(3);
        ctx.session!.emailVerify = {
            email: params.email,
            code,
            timestamp: Date.now(),
        };

        if (process.env.NODE_ENV === 'production') {
            mailerQueue.push({
                options: {
                    toList: [{ email: params.email }],
                    data: { code },
                    type: 'emailverify',
                },
            });
        } else {
            console.info(code);
        }

        return new RouteControllerResult(true);
    }
}

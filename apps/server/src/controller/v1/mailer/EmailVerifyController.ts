import { mailerQueue } from '@/queue/mailerQueue';
import { getRandomByte } from '@/utils/cryptoToken';
import { AssertParams, AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
import { Context } from 'koa';

interface EmailVerifyParams {
    email: string;
}

@RouteController()
class EmailVerifyController implements AsyncRouteController<EmailVerifyParams, true> {
    @AssertParams('email')
    async execute(params: EmailVerifyParams, ctx: Context): Promise<RouteControllerResult<true>> {
        const code = getRandomByte(3);
        ctx.session!.emailVerify = {
            email: params.email,
            code,
            timestamp: Date.now(),
        };
        console.log(code);

        // mailerQueue.push({
        //     options: {
        //         toList: [{ email: params.email }],
        //         data: { code },
        //         type: 'emailverify',
        //     },
        // });

        return new RouteControllerResult(true);
    }
}

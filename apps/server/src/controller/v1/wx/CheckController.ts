import { Context } from 'koa';
import crypto from 'crypto';
import { AsyncRouteController, RouteController } from '@swai/route-controller';
import config from '@/common/serverConfig';

interface CheckControllerParams {
    signature: string;
    timestamp: string;
    nonce: string;
    echostr: string;
}

@RouteController({
    methods: 'get',
})
class CheckController implements AsyncRouteController<CheckControllerParams, void> {
    async execute(params: CheckControllerParams, ctx: Context): Promise<any> {
        const token = config.get('wx').token;

        if (!token) {
            throw new Error('system error');
        }

        const { signature, timestamp, nonce, echostr } = params;

        const tmpArr = [token, timestamp, nonce].sort();
        const tmpStr = crypto.createHash('sha1').update(tmpArr.join('')).digest('hex');

        if (tmpStr !== signature) {
            throw new Error('check failed');
        }

        ctx.status = 200;
        ctx.body = echostr;
    }
}

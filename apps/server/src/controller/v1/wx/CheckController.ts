import { Context } from 'koa';
import crypto from 'crypto';
import { AsyncRouteController, RouteController, RouteControllerResult } from '@swai/route-controller';
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
class CheckController implements AsyncRouteController<CheckControllerParams, string> {
    async execute(params: CheckControllerParams, ctx: Context): Promise<RouteControllerResult<string>> {
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

        return new RouteControllerResult(echostr);
    }
}

import type { Context } from 'koa';
import { TOURIST_UUID_KEY } from '@/common/constant';

export function TouristLogin() {
    return (_target: any, _prop: string, descriptor: PropertyDescriptor) => {
        const value = descriptor.value;

        descriptor.value = function (params: any, ctx: Context) {
            const vuid = ctx.cookies.get(TOURIST_UUID_KEY);
            if (!vuid) {
                throw new Error('你必须先订阅该站点');
            }

            return value.call(this, params, ctx);
        };
    };
}

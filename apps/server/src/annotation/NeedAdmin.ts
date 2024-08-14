import { TOURIST_UUID_KEY } from '@/common/constant';
import { RouteFailedResult } from '@swai/route-controller';
import { Context } from 'koa';

export function NeedAdmin() {
    return (_target: any, _prop: string, descriptor: PropertyDescriptor) => {
        const value = descriptor.value;

        descriptor.value = async function (this: any, params: any, ctx: Context) {
            const ADMIN_UUID = ctx.session!.ADMIN_UUID;
            const UUID = ctx.cookies.get(TOURIST_UUID_KEY);

            if (!ADMIN_UUID || ADMIN_UUID !== UUID) {
                return new RouteFailedResult(new Error('No permission'));
            }

            return value.call(this, params, ctx);
        };
    };
}

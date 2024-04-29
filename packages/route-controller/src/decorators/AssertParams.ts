import type { Context } from 'koa';
import assert from 'assert';

export function AssertParams(...keys: string[]) {
    return (_target: any, _prop: string, descriptor: PropertyDescriptor) => {
        const value = descriptor.value;

        descriptor.value = function (params: any, ctx: Context) {
            for (const key of keys) {
                assert(params[key], `Parameter ${key} is required`);
            }

            return value.call(this, params, ctx);
        };
    };
}

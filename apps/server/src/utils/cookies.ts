import { TOURIST_UUID_KEY } from '@/common/constant';
import { Context } from 'koa';

export function setTouristCookies(ctx: Context, value: any) {
    ctx.cookies.set(TOURIST_UUID_KEY, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    });
}

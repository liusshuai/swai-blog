import { Context } from 'koa';

export function checkEmailCode(ctx: Context, data: { email: string; code: string }) {
    const now = Date.now();
    const { email, code } = data;
    const verifyPayload = ctx.session!.emailVerify;
    if (!verifyPayload || now - verifyPayload.timestamp > 30 * 60 * 1000) {
        throw new Error('验证码已过期');
    }

    if (verifyPayload.email !== email || verifyPayload.code !== code) {
        throw new Error('验证码错误');
    }
}

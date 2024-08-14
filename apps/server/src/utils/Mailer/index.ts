import nodemailer from 'nodemailer';
import config from '../../common/serverConfig';
import { makeEmailVerifyCodeTemplate } from './templates';
import { runtimeLogger } from '../Logger';

const sender_address = `"LSSHUAISL" <yigehaoren_gdoer@163.com>`;
const mailConfig = config.get('mailer');

const transporter = nodemailer.createTransport({
    // @ts-ignore
    host: mailConfig.host,
    secureConnection: true,
    port: 465,
    auth: {
        user: mailConfig.username,
        pass: mailConfig.password,
    },
});

export type SendMailType = 'emailverify';
export interface SendMailOptions<T = any> {
    toList: { nickname?: string; email: string }[];
    data: T;
}

export function sendEmailVerify(options: SendMailOptions<{ code: string }>) {
    const to = options.toList[0];
    return transporter.sendMail({
        from: sender_address,
        to: to ? to.email : '',
        subject: '邮箱验证',
        html: makeEmailVerifyCodeTemplate({
            nickname: to.nickname || '',
            code: options.data.code,
        }),
    });
}

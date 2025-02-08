import ejs from 'ejs';
import path from 'path';
import nodemailer from 'nodemailer';
import config from '../../common/serverConfig';

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

function sendMailByTemplate(filename: string, options: SendMailOptions) {
    return new Promise((resolve, reject) => {
        ejs.renderFile(path.resolve(__dirname, filename), options.data, (err, html) => {
            if (err) {
                reject(err);
            }

            const to = options.toList.map((row) => row.email).join(', ');
            transporter
                .sendMail({
                    from: sender_address,
                    to: to,
                    subject: '邮箱验证',
                    html,
                })
                .then(resolve)
                .catch(reject);
        });
    });
}

export function sendEmailVerify(options: SendMailOptions<{ code: string; [key: string]: string }>) {
    options.data.nickname = options.toList[0]?.nickname || '';
    options.data.minutes = '30';

    return sendMailByTemplate('./template/emailVerify.ejs', options);
}

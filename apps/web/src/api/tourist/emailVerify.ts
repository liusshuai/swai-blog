import { post } from '@/utils/request';

interface EmailVerifyParams {
    code: string;
    email: string;
}
export function emailVerify(params: EmailVerifyParams) {
    return post('/api/v1/mailer/emailVerify', params);
}

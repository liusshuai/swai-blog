import { get } from '@/utils/request';

export function getCaptchaCode() {
    return get<string>('/api/v1/captcha/get');
}

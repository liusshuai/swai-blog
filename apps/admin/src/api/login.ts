import { UserInfo } from '@swai/types';
import { get, post } from './request';

export function getCaptchaCode() {
    return get<string>('/api/v1/captcha/get');
}

export function sendEmailVerifyCode(params: { email: string; code: string }) {
    return post<boolean>('/api/v1/mailer/emailVerify', params);
}

interface LoginParams {
    email: string;
    code: string;
}
export function login(params: LoginParams) {
    return post('/api/v1/admin/auth/login', params);
}

export function logout() {
    return post('/api/v1/admin/auth/logout');
}

export function getAdminInfo() {
    return get<UserInfo>('/api/v1/admin/auth/getInfo');
}

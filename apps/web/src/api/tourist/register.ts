import { get, post } from '@/utils/request';
import { TouristProfile } from '@swai/types';

interface TouristRegisterParams {
    email: string;
    nickname: string;
    website: string;
    verifyCode: string;
    avatar_style: string;
    avatar_search: string;
}
export function register(params: TouristRegisterParams) {
    return post<TouristProfile>('/api/v1/tourist/register', params);
}

export function findByEmail(params: Pick<TouristRegisterParams, 'email' | 'verifyCode'>) {
    return post<TouristProfile>('/api/v1/tourist/findByEmail', params);
}

export function getTouristInfo() {
    return get<TouristProfile>('/api/v1/tourist/getTouristInfo');
}

export function updateTouristInfo(params: TouristRegisterParams) {
    return post<TouristProfile>('/api/v1/tourist/updateInfo', params);
}

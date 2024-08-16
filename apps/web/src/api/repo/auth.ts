import { get } from '@/utils/request';
import { UserInfo } from '@swai/types';

export function getAuthInfo() {
    return get<UserInfo>('/api/v1/user/getInfo');
}

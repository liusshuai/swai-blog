import { TouristProfile } from '@swai/types';
import { get, post } from './request';
import { PaginationParams } from './types';

export interface GetTouristListParams extends PaginationParams {
    email?: string;
    nickname?: string;
    is_black?: string;
    un_followed?: string;
}
export function getTouristList(params: GetTouristListParams) {
    return post<{
        total: number;
        list: TouristProfile[];
    }>('/api/v1/admin/tourist/getList', params);
}

export interface ChangeTouristStateParams {
    id: string;
    un_followed?: boolean;
    is_black?: boolean;
}
export function changeTouristState(data: ChangeTouristStateParams) {
    return post<{
        id: string;
        success: boolean;
    }>('/api/v1/admin/tourist/changeState', data);
}

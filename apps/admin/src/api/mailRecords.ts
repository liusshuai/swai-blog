import type { MailSendType, MailSendState } from '@swai/types';
import { post } from './request';
import { PaginationParams } from './types';

export type MailSendRecord = {
    id: number;
    email: string;
    type: MailSendType;
    state: MailSendState;
    create_at: string;
    update_at: string;
};

export type GetMailSendRecordsParams = {
    email?: string;
    type?: MailSendType;
    state?: MailSendState;
    startAt?: number;
    endAt?: number;
};
export function getMailSendRecords(params: GetMailSendRecordsParams & PaginationParams) {
    return post<{
        page: number;
        total: number;
        list: MailSendRecord[];
    }>('/api/v1/admin/MailRecord/getList', params);
}

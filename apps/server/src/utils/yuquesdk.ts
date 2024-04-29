import axios, { type AxiosRequestConfig } from 'axios';
import serverConfig from '../common/serverConfig';
import { V2User } from '../types/YuQueSerializer/User';
import { V2BookDetail } from '@/types/YuQueSerializer/BookDetail';
import { V2Doc } from '@/types/YuQueSerializer/Doc';
import { V2DocDetail } from '@/types/YuQueSerializer/DocDetail';
import { V2TocItem } from '@/types/YuQueSerializer/TocItem';
import { V2DocSearchResult } from '@/types/YuQueSerializer/SearchResult';

const configs = serverConfig.get('yuque');

export class YuqueSdk {
    private readonly client = axios.create({
        baseURL: configs.baseUrl,
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'LSSHUAI`Blog',
            'X-Auth-Token': configs.authToken,
        },
    });

    private request<T>(config: AxiosRequestConfig): Promise<T> {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await this.client.request<T>(config);

                resolve(res.data);
            } catch (e) {
                reject(e);
            }
        });
    }

    private get<T>(url: string, params?: any) {
        return this.request<T>({
            url,
            params,
            method: 'GET',
        });
    }

    private post<T>(url: string, data: any) {
        return this.request<T>({
            url,
            data,
            method: 'POST',
        });
    }

    getUserInfo() {
        return this.get<{ data: V2User }>(`/user`);
    }

    getRepoDetail() {
        return this.get<{ data: V2BookDetail }>(`/repos/${configs.bookId}`);
    }

    getRepoDocs(page = 1, pageSize = 10) {
        return this.get<{ data: V2Doc[] }>(`/repos/${configs.bookId}/docs`, {
            optional_properties: 'hits,tags',
            limit: pageSize,
            offset: (page - 1) * pageSize,
        });
    }

    getRepoToc() {
        return this.get<{ data: V2TocItem[] }>(`/repos/${configs.bookId}/toc`);
    }

    getDocDetail(id: number) {
        return this.get<{ data: V2DocDetail }>(`/repos/${configs.bookId}/docs/${id}`);
    }

    searchDoc(q: string, namespace?: string) {
        return this.get<{ data: V2DocSearchResult[] }>(`/search`, {
            q,
            type: 'doc',
            scope: namespace,
        });
    }
}

export default new YuqueSdk();

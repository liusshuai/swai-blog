import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const request = axios.create({
    baseURL: 'http://localhost:3001',
    headers: {
        'device': 'app',
    },
});

request.interceptors.request.use(function(config) {
    /**
     * 
     */

    return config;
});

function responseHandler<T>(response: AxiosResponse<{
    code: number;
    msg: string;
    data: T;
}, any>): T {
    const { data } = response;

    if (data.code !== 200) {
        throw new Error(data.msg);
    }

    return data.data;
}

export function get<T>(url: string, params?: any) {
    return new Promise<T>((resolve, reject) => {
        request.get(url, {
            params,
        })
            .then((result) => {
                const res = responseHandler<T>(result);

                resolve(res);
            })
            .catch((e) => {
                reject(e);
            });
    });
}

export function post<T>(url: string, data?: any, configs?: AxiosRequestConfig<any>) {
    return new Promise<T>((resolve, reject) => {
        request.post(url, data, configs)
            .then((result) => {
                const res = responseHandler<T>(result);

                resolve(res);
            })
            .catch((e) => {
                reject(e);
            });
    });
}

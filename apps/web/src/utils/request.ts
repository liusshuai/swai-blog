export function get<T>(api: string, params?: Record<string, any>) {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}${api}`);

    if (params) {
        for (const k in params) {
            url.searchParams.append(k, JSON.stringify(params[k]));
        }
    }

    return new Promise<T>((resolve, reject) => {
        fetch(url.href, {
            method: 'GET',
            credentials: 'include',
        })
            .then((res) => {
                res.json()
                    .then((data) => {
                        resolve(data.data);
                    })
                    .catch((e) => errorHandler(e, reject));
            })
            .catch((e) => errorHandler(e, reject));
    });
}

export function post<T>(api: string, data?: Record<string, any>) {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}${api}`);

    return new Promise<T>((resolve, reject) => {
        fetch(url.href, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
        })
            .then((res) => {
                res.json()
                    .then((data) => {
                        if (data.code === 200) {
                            resolve(data.data);
                        } else {
                            errorHandler(new Error(data.msg), reject);
                        }
                    })
                    .catch((e) => errorHandler(e, reject));
            })
            .catch((e) => errorHandler(e, reject));
    });
}

function errorHandler(e: Error, reject: (reason?: any) => void) {
    typeof window !== undefined && alert(e.message);

    reject(e);
}

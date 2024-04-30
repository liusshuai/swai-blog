export function get<T>(api: string, params?: Record<string, string>) {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}${api}`);

    if (params) {
        for (const k in params) {
            url.searchParams.append(k, params[k]);
        }
    }

    return new Promise<T>((resolve, reject) => {
        fetch(url.href)
            .then((res) => {
                res.json()
                    .then((data) => {
                        resolve(data.data);
                    })
                    .catch(reject);
            })
            .catch(reject);
    });
}

export function get<T>(api: string, params?: Record<string, string>) {
    const url = new URL(`http://localhost:3001${api}`);

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

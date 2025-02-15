import qs from 'qs'
export async function mdmApiServer<T>(
    path: string,
    searchParams?: Record<string, any>,
    args?: { next: NextFetchRequestConfig }
): Promise<T> {
    const spreadArgs = args || {}
    return fetch(
        `${process.env.NEXT_PUBLIC_MDM_API_URL}/${path?.startsWith('/') ? path.replace('/', '') : path}?${qs.stringify(
            searchParams
        )}`,
        spreadArgs
    ).then((res) => res.json() as T)
}

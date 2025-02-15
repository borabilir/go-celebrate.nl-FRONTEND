/**
 * https://swr.vercel.app/blog/swr-v1.en-US#no-more-default-fetcher
 * We can also reuse this function for server-side data fetching.
 *
 * DO NOTE!
 * Server side fetch is different from what happens on the client side.
 * Refer to the next.js docs: https://nextjs.org/docs/app/api-reference/functions/fetch
 */

export type FetcherProps = {
    url: any
    locale: string
    cache?: RequestCache
    revalidate?: number | false | undefined
    /* If we have an active user session, we can pass in the back-office token. */
    token?: string
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    body?: any
}

export async function fetcher({ url, cache, revalidate, token, method = 'GET', body }: FetcherProps) {
    const init: RequestInit = {
        method,
        body,
        headers: {
            'Content-Type': 'application/json',
        },
    }
    if (token) init.headers = { ...init.headers, Authorization: `Bearer ${token}` }
    if (cache) init.cache = cache
    if (revalidate) init.next = { revalidate }
    const res = await fetch(url, init)
    return await res.json()
}

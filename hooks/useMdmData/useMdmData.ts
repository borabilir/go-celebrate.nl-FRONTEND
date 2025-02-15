import { atom, useAtom } from 'jotai'
import useSWR, { SWRConfiguration } from 'swr'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { fetcher } from '@/lib/fetcher'
import qs from 'qs'

import { MDMApiHookReturnType, StrapiApiQueryParams } from '@/@types/mdm'

const MDM_API_URL = process.env.NEXT_PUBLIC_MDM_API_URL
const availableLocales = process.env.NEXT_PUBLIC_ACTIVE_LANGUAGES?.split(',') || ['nl']
const defaultLocale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'nl'

const loadingAtom = atom(false)
const errorAtom = atom<Error | null | unknown>(null)

/**
 * `useMDMAPI` is a custom React hook that provides an abstraction over the `fetch` function,
 * specially configured to interact with the MDM (Master Data Manager) API. This hook is designed to simplify data fetching
 * or sending tasks in a React application by encapsulating the common behaviors of handling loading and error states.
 *
 * The hook returns an object that includes:
 * - `loading`: A boolean state that indicates whether the request is currently in progress.
 * - `error`: A state that holds the error object if an error occurred during the request.
 * - `sendData`: A function that can be called to send data to a specific MDM API endpoint. This function
 *   takes the API endpoint url and an options object that includes the `body` and `method` of the request.
 * - `useData`: A function that fetches data from a specific MDM API endpoint using the SWR library. This function
 *   takes the API endpoint url and an optional SWR configuration object.
 *
 * The `sendData` and `useData` functions automatically handle the setting and clearing of the loading and error states,
 * so there's no need to manually control these states during the request.
 *
 * @returns {MDMApiHookReturnType} An object containing the `loading`, `error`, `sendData`, and `useData` fields.
 *
 * @example
 * const { loading, error, sendData, useData } = useMDMAPI();
 *
 * // To fetch data:
 * const { data, error } = useData('/endpoint');
 * if (error) return <div>{error.message}</div>;
 * if (!data) return <div>Loading...</div>;
 * return <div>{data.map((item) => item.name)}</div>;
 *
 * // To send data:
 * const body = { key: 'value' };
 * sendData('/endpoint', { body, method: 'POST' });
 */
export function useMDMAPI(): MDMApiHookReturnType {
    const { data: sessionData } = useSession()
    let { locale = defaultLocale } = useParams() as { locale: string }
    if (!availableLocales.includes(locale)) locale = defaultLocale || 'nl'
    const [loading, setLoading] = useAtom(loadingAtom)
    const [error, setError] = useAtom(errorAtom)

    const swrFetcher = async (url: string, cache: RequestCache) => {
        setLoading(true)
        try {
            const res = await fetcher({ url, locale, cache, token: sessionData?.user?.jwt })
            if (res.error) {
                throw new Error(res.error.message)
            }
            return res
        } catch (error) {
            setError(error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const sendData = async (
        url: string,
        {
            body,
            method = 'POST',
        }: {
            body: any
            method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
        }
    ) => {
        setLoading(true)
        try {
            const res = await fetcher({
                url: `${MDM_API_URL}${url}`,
                body: JSON.stringify(body),
                method,
                locale,
                token: sessionData?.user?.jwt,
            })
            if (res.error) {
                throw new Error(res.error.message)
            }
            return res
        } catch (error) {
            setError(error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const useData = <DataType>(
        urlOrConfig:
            | string
            | {
                  path: string
                  queryParams?: StrapiApiQueryParams
              },
        config?: SWRConfiguration,
        cache?: RequestCache
    ) => {
        const { path, queryParams = {} } = typeof urlOrConfig === 'string' ? { path: urlOrConfig } : urlOrConfig
        const { locale: localeOverride, fields, populate, filters, pagination, sort } = queryParams
        const apiURL = `${MDM_API_URL}/api${path.startsWith('/') ? path : `/${path}`}`

        // Build the query string parameters
        const queryParamsObject: StrapiApiQueryParams = {
            locale: localeOverride || locale,
            fields,
            populate,
            filters,
            pagination,
            sort,
        }

        const queryParamsString = qs.stringify(queryParamsObject, {
            encodeValuesOnly: true,
            arrayFormat: 'brackets',
        })

        const queryURL = `${apiURL}?${queryParamsString}`
        if (config?.fallback) {
            /**
             * Here we simplify the usage of fallback data by allowing the user to pass in a single
             * fallback data object instead of an object with a key that matches the query url.
             * This is because the query url can be dynamic, and it's not always possible to know
             * what the query url will be at the time of writing the code.
             * https://swr.vercel.app/docs/advanced/cache
             * As fallback data is stored in the cache per key (that is equivalent to the query
             * url), we need to make sure that the fallback data is stored in the cache with the
             * same key as the query url.
             */
            config.fallback = {
                [queryURL]: config.fallback,
            }
        }
        return useSWR<DataType>(queryURL, swrFetcher, config)
    }

    return {
        loading,
        error,
        sendData,
        useData,
        swrFetcher,
    }
}

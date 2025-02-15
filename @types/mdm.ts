import { SWRConfiguration, SWRResponse } from 'swr'

/* General API typings */

export type MDMApiHookReturnType = {
    loading: boolean
    /** For the error message */
    error: string | null | unknown
    /** Mainly for validations, contains the list of field keys and messages */
    sendData: <ResultType>(
        url: string,
        {
            body,
            method = 'POST',
        }: {
            body: any
            method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
        }
    ) => Promise<ResultType>
    useData: <DataType>(
        url: string | { path: string; queryParams?: StrapiApiQueryParams },
        config?: SWRConfiguration,
        cache?: RequestCache
    ) => SWRResponse<DataType, any>
    swrFetcher: (url: string, cache: RequestCache) => Promise<any>
}

export interface StrapiApiQueryParams {
    locale?: string
    fields?: string[]
    populate?: string[] | Record<string, StrapiApiQueryParams>
    filters?: Record<string, StrapiFilterExpression>
    pagination?: StrapiPaginationOptions
    sort?: string | string[]
}

export type StrapiFilterExpression =
    | StrapiFilterOperatorExpression
    | StrapiFilterComparisonExpression
    | StrapiFilterLogicalExpression
    | StrapiFilterValue

export interface StrapiFilterOperatorExpression {
    [operator: string]: StrapiFilterExpression | StrapiFilterExpression[]
}

export interface StrapiFilterComparisonExpression {
    $eq?: StrapiFilterValue
    $eqi?: StrapiFilterValue
    $ne?: StrapiFilterValue
    $lt?: StrapiFilterValue
    $lte?: StrapiFilterValue
    $gt?: StrapiFilterValue
    $gte?: StrapiFilterValue
    $in?: StrapiFilterValue[]
    $notIn?: StrapiFilterValue[]
    $contains?: StrapiFilterValue
    $notContains?: StrapiFilterValue
    $containsi?: StrapiFilterValue
    $notContainsi?: StrapiFilterValue
    $null?: boolean
    $notNull?: boolean
    $between?: [StrapiFilterValue, StrapiFilterValue]
    $startsWith?: StrapiFilterValue
    $startsWithi?: StrapiFilterValue
    $endsWith?: StrapiFilterValue
    $endsWithi?: StrapiFilterValue
}

export interface StrapiFilterLogicalExpression {
    $or?: StrapiFilterExpression[]
    $and?: StrapiFilterExpression[]
    $not?: StrapiFilterExpression[]
}

export type StrapiFilterValue = string | number | boolean

export type StrapiPaginationOptions = StrapiPagePaginationOptions | StrapiStartLimitPaginationOptions

export interface StrapiPagePaginationOptions {
    page: number
    pageSize: number
}

export interface StrapiStartLimitPaginationOptions {
    start: number
    limit: number
}

/* Data type typings */
export interface attributeTypeProps {
    id: string
    attributes: {
        key: string
        name: string
        locale: string
        allowAsPreference: boolean
        attributeDefinitions: {
            data: attributeDefinitionProps[]
        }
    }
}

export interface attributeDefinitionProps {
    id: string
    attributes: {
        key: string
        name: string
        locale: string
    }
}

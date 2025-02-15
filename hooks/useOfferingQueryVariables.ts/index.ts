'use client'
import { StoryblokBlok } from '@/@types/storyblok'
import { atom, useAtom } from 'jotai'
import { useMemo } from 'react'

type UseOfferingQueryVariables = {
    categories_filter: string[]
    attributes_filter: string[]
    fullWidth: boolean
    cities_filter: string[]
    regions_filter: string[]
    id_filter: string[]
    maxItems: number
}

export function useOfferingQueryVariables(blok: StoryblokBlok<UseOfferingQueryVariables>, locale: string) {
    const {
        categories_filter,
        attributes_filter,
        fullWidth,
        cities_filter = [],
        regions_filter = [],
        id_filter = [],
        maxItems,
    } = blok
    const variablesAtom = useMemo(
        () =>
            atom({
                filters: {} as any,
                locale,
                pagination: {
                    start: 0,
                    limit: 24,
                },
                sort: 'id', // If we don't sort on something, we might get duplicate results, this is a Strapi bug most likely
                fields: ['name', 'key', 'excerpt', 'slug'],
                populate: ['coverPhoto', 'vendor', 'categories'],
            }),
        [locale]
    )
    const [variables, setVariables] = useAtom(variablesAtom)
    if (categories_filter && categories_filter.length > 0) {
        variables.filters.categories = {
            key: {
                $in: categories_filter || null,
            },
        }
    }
    if (attributes_filter && attributes_filter.length > 0) {
        variables.filters.offeringAttributes = {
            $or: [],
        }
        attributes_filter.map((attribute: string) => {
            variables.filters.offeringAttributes.$or.push({
                value: {
                    $contains: attribute,
                },
            })
        })
    }
    if (cities_filter && cities_filter.length > 0) {
        variables.filters.baseCity = {
            key: {
                $in: cities_filter,
            },
        }
    }
    if (regions_filter && regions_filter.length > 0) {
        variables.filters.baseRegion = {
            key: {
                $in: regions_filter,
            },
        }
    }
    return {
        variables,
        setVariables,
    }
}

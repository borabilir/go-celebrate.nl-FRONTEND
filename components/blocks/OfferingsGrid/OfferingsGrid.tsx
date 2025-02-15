import { OfferingsGridClient } from './OfferingsGridClient'
import qs from 'qs'

export async function OfferingsGrid(props: any, locale = 'nl') {
    const { blok } = props
    const variables: any = {
        locale,
        filters: {},
        pagination: {
            start: 0,
            limit: 24,
        },
        sort: 'id',
        fields: ['name', 'key', 'excerpt', 'slug'],
        populate: ['coverPhoto', 'vendor', 'categories'],
    }
    const { categories_filter, attributes_filter, cities_filter = [], regions_filter = [] } = blok
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
    let data: any = {}
    const url = `${process.env.NEXT_PUBLIC_MDM_API_URL}/offerings?${qs.stringify(variables, {
        encodeValuesOnly: true,
    })}` as string
    try {
        const result = await fetch(url)
        const { data: offerings, meta } = await result.json()
        data.data = offerings
        data.meta = meta
    } catch (error) {
        console.error(error)
    }
    return <OfferingsGridClient {...props} data={data} />
}

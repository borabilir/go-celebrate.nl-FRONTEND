/**
 * This lib takes care of loading MDM data for nestable storyblok components.
 * If you include the "Categories" component in Storyblok, here the categories from MDM get loaded
 * and included.
 *
 * @param {object} story - The Storyblok story object of a page
 */

import client from '@/apollo/clients/mdm'
import CategoryGroupsQuery from '@/apollo/queries/category/categoryGroups.gql'
import CategoriesQuery from '@/apollo/queries/category/categories.gql'

import Storyblok from '@/lib/storyblok' //??TODOHIGH: this might cause circular imports. 
// but first check if it is used.

/* OFFERING */
import OfferingsQuery from '@/apollo/queries/offering/offerings.gql'
import OfferingsWithExtendedInfoQuery from '@/apollo/queries/offering/offeringsWithExtendedInfo.gql'

import AttributeTypesQuery from '@/apollo/queries/attribute/attributeTypes.gql'

/* OCCASION */
import OccasionsListQUery from '@/apollo/queries/occasion/occasionsList.gql'

async function fetchOfferings(
    variables,
    extended // For retrieving for the offering page with images, etc...
) {
    try {
        const {
            data: { offerings },
        } = await client.query({
            query: extended ? OfferingsWithExtendedInfoQuery : OfferingsQuery,
            variables,
        })
        return offerings
    } catch (error) {
        console.error('Fetch offerings error: ', error)
        return null
    }
}

async function fetchOccasions(variables) {
    const {
        data: { occasions },
    } = await client.query({
        query: OccasionsListQUery,
        variables,
    })
    return occasions
}

/* Hydrate Storyblok components with MDM data */
async function hydrateMdmData(story, locale) {
    const DEPLOYMENT_URL = `${process.env.NEXT_PUBLIC_DEPLOYMENT_NAME}/${locale.toLowerCase()}`

    if (!story) {
        console.warn('Missing story argument. MDM Data cannot be hydrated.')
        return null
    }
    if (!locale) {
        console.warn('Missing locale argument. MDM Data cannot be hydrated.')
        return null
    }
    try {
        if (story.content?.body) {
            const hydratedContent = await componentMatcher(story.content, locale, DEPLOYMENT_URL)
            if (hydratedContent) {
                story.content = hydratedContent
            }
            await Promise.all(
                story.content?.body?.map(async (blok, index) => componentMatcher(blok, locale, DEPLOYMENT_URL))
            )
        }
    } catch (error) {
        console.error('Foo error', error)
    }
    return story
}

async function componentMatcher(blok, locale, DEPLOYMENT_URL) {
    switch (blok.component) {
        case 'CategoryGroups':
            const {
                data: { categoryGroups },
            } = await client.query({
                query: CategoryGroupsQuery,
                variables: {
                    locale,
                },
            })
            if (categoryGroups) {
                Object.assign(blok, { data: categoryGroups })
            }
            break
        case 'Categories':
            const {
                data: { categories },
            } = await client.query({
                query: CategoriesQuery,
                variables: {
                    sort: 'name:ASC',
                    locale,
                },
            })
            if (categories) {
                Object.assign(blok, { data: categories })
            }
            break
        case 'OfferingList':
        case 'OfferingsGrid':
            const {
                categories_filter = [],
                attributes_filter = [],
                cities_filter = [],
                regions_filter = [],
                id_filter = [],
                showMoreLink,
                maxItems,
            } = blok
            const variables = {
                filters: {},
                locale,
                pagination: {
                    pageSize: 24,
                },
                sort: 'id', // If we don't sort on something, we might get duplicate results, this is a Strapi bug most likely
            }
            if (categories_filter && categories_filter.length > 0) {
                variables.filters.categories = {
                    key: {
                        in: categories_filter,
                    },
                }
            }
            if (attributes_filter && attributes_filter.length > 0) {
                variables.filters.offeringAttributes = {
                    or: [],
                }
                attributes_filter.map((attribute) => {
                    variables.filters.offeringAttributes.or.push({
                        value: {
                            contains: attribute,
                        },
                    })
                })
            }
            if (cities_filter && cities_filter.length > 0) {
                variables.filters.baseCity = {
                    key: {
                        in: cities_filter,
                    },
                }
            }
            if (regions_filter && regions_filter.length > 0) {
                variables.filters.baseRegion = {
                    key: {
                        in: regions_filter,
                    },
                }
            }
            if (id_filter) {
            }
            if (maxItems) variables.pagination.limit = maxItems
            const offerings = await fetchOfferings(variables)
            /* const {
                total,
                pageSize,
                pageCount,
                page
            } = offerings.meta.pagination */
            const {
                data: { attributeTypes },
            } = await client.query({
                query: AttributeTypesQuery,
                variables: {
                    pagination: {
                        pageSize: 1000,
                    },
                    attributesPagination: {
                        pageSize: 1000,
                    },
                    attributesSort: ['name'],
                    locale,
                },
            })

            if (offerings) {
                Object.assign(blok, { data: offerings })
            }
            if (attributeTypes) {
                Object.assign(blok, { attributeTypes })
            }
            break
        case 'BlogHome':
        case 'BlogPostsGrid':
            // Get all the pages that belong under the page where we requested our blog posts grid component
            const { data: stories } = await Storyblok.get(`cdn/stories/?starts_with=${story.full_slug}`)
            if (stories.stories) {
                Object.assign(blok, {
                    posts: stories.stories.filter((s) => s.full_slug !== story.full_slug),
                    blogUrl: story.full_slug.replace(DEPLOYMENT_URL, ''),
                })
            }
            break
        default:
            break
    }
    return blok
}

export { fetchOfferings, fetchOccasions, hydrateMdmData }

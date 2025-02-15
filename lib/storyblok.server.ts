// @ts-ignore
import { getStoryblokApi } from '@storyblok/react/rsc'

export async function fetchData(pathSegment: string, locale = 'nl') {
    const storyblokApi = getStoryblokApi()
    try {
        return await storyblokApi.get(
            `cdn/stories/${process.env.NEXT_PUBLIC_DEPLOYMENT_NAME}/${locale}${
                pathSegment
                    ? `/${pathSegment.replace(`${process.env.NEXT_PUBLIC_DEPLOYMENT_NAME}/${locale}/` as string, '')}`
                    : ''
            }`,
            { version: 'draft', resolve_links: 'story' }
        )
    } catch (error) {
        console.error('Storyblok fetch error: ', error)
        return null
    }
}

export async function fetchStories({
    starts_with,
    sort_by = 'published_at:desc',
    per_page = 5,
}: {
    starts_with: string
    sort_by?: string
    per_page?: number
}) {
    const storyblokApi = getStoryblokApi()
    try {
        return await storyblokApi.get('cdn/stories/', {
            version: 'draft',
            resolve_links: 'url',
            sort_by,
            per_page,
            starts_with,
        })
    } catch (error) {
        console.error('Storyblok fetch stories error: ', error)
        return null
    }
}

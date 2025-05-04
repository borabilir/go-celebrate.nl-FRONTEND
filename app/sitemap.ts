import { MetadataRoute } from 'next'
// @ts-ignore
import { storyblokInit, apiPlugin } from '@storyblok/react/rsc'
// @ts-ignore
import { getStoryblokApi } from '@storyblok/react/rsc'

storyblokInit({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
    use: [apiPlugin],
})

async function fetchStoryes(storyblokApi: any, locale: string, page: number = 1) {
    const DEPLOYMENT_URL = `${process.env.NEXT_PUBLIC_DEPLOYMENT_NAME}/${locale.toLowerCase()}`
    const { data, perPage, total } = await storyblokApi.get(`cdn/stories/`, {
        starts_with: DEPLOYMENT_URL,
        per_page: 20,
        page,
    })
    return {
        stories: data?.stories,
        perPage,
        total,
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const storyblokApi = getStoryblokApi()
    const languages = process.env.NEXT_PUBLIC_ACTIVE_LANGUAGES?.split(',') || ['nl']
    const defaultLocale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'nl'
    const sitemap: { url: string; lastModified: string | Date | undefined }[] = []
    for (const locale of languages) {
        const DEPLOYMENT_URL = `${process.env.NEXT_PUBLIC_DEPLOYMENT_NAME}/${locale.toLowerCase()}`
        /**
         * STORIES
         */
        // Iterate through all pages until we have all storiey
        let data = await fetchStoryes(storyblokApi, locale)
        let i = 1
        while ((i - 1) * data?.perPage < data?.total) {
            const newData = await fetchStoryes(storyblokApi, locale, i)
            if (process.env.NEXT_PUBLIC_INFO_LOGGING_MODE === 'true') {
                console.log('newData length', i, newData?.stories?.length) 
            }
            data = {
                stories: [...data?.stories, ...newData?.stories],
                perPage: newData.perPage,
                total: newData.total,
            }
            i++
        }
        if (data?.stories) {
            data?.stories?.map((story: any) => {
                const slug = story.full_slug
                if (
                    // Ignore folder roots (folder pages will be included)
                    !story.is_folder &&
                    // Also skip the content where we stored our page globals
                    slug !== `${DEPLOYMENT_URL}/globals`
                ) {
                    // Explode the slug and ignore the site and language, since we don't want that those to be incorporated
                    let [site, language, ...splittedSlug] = slug.split('/')
                    // We don't story to match the root page, since that is already handled by the [locale] route
                    if (splittedSlug.length > 0 && splittedSlug.filter((s: string) => s !== '').length > 0) {
                        sitemap.push({
                            url: `${process.env.NEXT_PUBLIC_BASE_URL}/${
                                locale === defaultLocale ? '' : `${locale}/`
                            }${splittedSlug.join('/')}`,
                            lastModified: story.published_at,
                        })
                    }
                }
            })
        }
        /**
         * OFFERINGS
         */
        const offeringsRequest = await fetch(
            `${process.env.NEXT_PUBLIC_MDM_API_URL}/offerings?locale=${locale}&pagination[limit]=1000`
        )
        const offerings = await offeringsRequest.json()
        offerings?.data?.map((offering: any) => {
            sitemap.push({
                url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale === defaultLocale ? '' : `${locale}/`}vendor/${
                    offering.attributes.slug
                }`,
                lastModified: offering.attributes.updated_at,
            })
        })
    }
    return sitemap
}

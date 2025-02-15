import Storyblok from '@/lib/storyblok'
import hydrateStoryblok from '@/lib/storyblok.hydrate'

/**
 * Reusable functions for React static path generation.
 */

export async function getLinksForStaticPaths(locales) {
    if (!locales || !Array.isArray(locales))
        throw new Error("Locales must be passed as an array of iso locales, e.g.: ['en']")
    // promise all because .map doesn't support async
    const paths = []
    await Promise.all(
        // Loop through Storyblok paths
        locales.map(async (locale) => {
            const DEPLOYMENT_URL = `${process.env.NEXT_PUBLIC_DEPLOYMENT_NAME}/${locale.toLowerCase()}`
            // Get all links from Storyblok, but scope them to the language and deployment
            const { data } = await Storyblok.get(`cdn/links/?starts_with=${DEPLOYMENT_URL}`, {
                cv: Date.now(),
            })
            // Create a routes for every link
            Object.keys(data.links).forEach((linkKey) => {
                // Do not create a route for folders
                if (
                    data.links[linkKey].is_folder ||
                    // Do not generate the home page here either
                    data.links[linkKey].slug === `${DEPLOYMENT_URL}/` ||
                    // Also skip the content where we stored our page globals
                    data.links[linkKey].slug === `${DEPLOYMENT_URL}/globals`
                ) {
                    return
                }
                // Get array for slug because of next.js's "catch all" in routing
                const slug = data.links[linkKey].slug
                // Explode the slug and ignore the site and language, since we don't want that those to be incorporated
                let [site, language, ...splittedSlug] = slug.split('/')
                // Skip the home page
                if (splittedSlug) {
                    // Add to the routes
                    paths.push({
                        params: {
                            /* Remove empty strings for nested route roots */
                            slug: splittedSlug,
                        },
                        locale,
                    })
                }
            })
        })
    )
    return paths
}

export async function getStoryForStaticProps({ params, locale, preview }) {
    const DEPLOYMENT_URL = `${process.env.NEXT_PUBLIC_DEPLOYMENT_NAME}/${locale.toLowerCase()}`

    // join the slug array used in Next.js catch-all routes, consider eventual home page (should be folder root otw)
    let slug = params.slug ? params.slug.join('/') : ''

    let sbParams = {
        // change to `published` to load the published version
        version: 'published', // or published
        resolve_links: 'story',
    }

    console.log(preview)

    if (preview) {
        // set the version to draft in the preview mode
        sbParams.version = 'draft'
        // In case of preview set cache value for now
        sbParams.cv = Date.now()
    }

    /**
     * Unfortunately we have to check every single link before building a page.
     * That is due to how Storyblok and next.js handles trailing slashes.
     * Every sory is without a trailing "/", such as next.js resolves slash-less URLs.
     * However, a storyblok story that is the root of a folder can only be retrieved with a
     * trailing slash.
     *
     * So if an URL wouldn't resolve without "/", we try it with "/" as well.
     */

    let data
    try {
        // First attempt without "/"
        let { data: storyblokData } = await Storyblok.get(`cdn/stories/${DEPLOYMENT_URL}/${slug || ''}`, sbParams)
        data = storyblokData
        console.log('Fetching from ' + `cdn/stories/${DEPLOYMENT_URL}/${slug || ''}`)
    } catch (err) {
        console.error(err)
    }
    if (!data) {
        // Second attempt with "/"
        let { data: storyblokData } = await Storyblok.get(`cdn/stories/${DEPLOYMENT_URL}/${slug}/`, sbParams)
        data = storyblokData
    }

    /*
     * Pre-fetch articles for the blog home page so they can be server-rendered.
     */
    if (data?.story?.content?.component === 'BlogHome') {
        // Get all the pages that belong under the page where we requested our blog posts page type
        const { data: stories } = await Storyblok.get(`cdn/stories/?starts_with=${data.story.full_slug}`)
        if (stories.stories) {
            // Remove also the featured article to avoid duplicates
            const featured = data?.story?.content.featuredArticle
            Object.assign(data.story.content, {
                posts: stories.stories.filter(
                    (s) =>
                        s.full_slug !== data.story.full_slug && (featured ? s.full_slug !== featured.cached_url : true)
                ),
                featuredPost: featured ? stories.stories.find((s) => s.full_slug === featured.cached_url) : null,
                blogUrl: data.story.full_slug.replace(DEPLOYMENT_URL, ''),
            })
        }
    }

    /*
     * Pre-fetch offerings for the offering list pages so they can be server-rendered.
     */
    if (data?.story?.content?.component === 'OfferingList') {
        /* Get the filters and fetch the related offerings */
    }

    data.story = await hydrateStoryblok(data?.story, locale)
    return data ? data.story : null
}

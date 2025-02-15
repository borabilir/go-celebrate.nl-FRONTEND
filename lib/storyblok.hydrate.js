/**
 * This lib takes care of loading data for nestable storyblok components.
 * E.g., If you include the "ProjectHighlight" component in Storyblok, the data belonging to the project will be populated
 *
 * @param {object} story - The Storyblok story object of a page
 */

import Storyblok from '@/lib/storyblok'

export default async function hydrateStoryblok(story, locale) {
    if (!story) {
        console.warn('Missing story argument. Component data cannot be hydrated.')
        return null
    }
    if (!locale) {
        console.warn('Missing locale argument. Component data cannot be hydrated.')
        return null
    }
    if (story.content?.body) {
        try {
            await Promise.all(
                story.content?.body?.map(async (blok) => {
                    switch (blok.component) {
                        case 'LatestBlogPosts':
                            if (!blok.blog.cached_url) return
                            const { data: posts } = await Storyblok.get(
                                `cdn/stories/?sort_by=published_at:desc&per_page=5&starts_with=${blok.blog.cached_url}`
                            )
                            if (posts?.stories) {
                                Object.assign(blok, {
                                    posts: posts.stories.filter((story) => story.full_slug !== blok.blog.cached_url), // Filter out the blog root
                                })
                            }
                        default:
                            break
                    }
                    return blok
                })
            )
        } catch (err) {
            console.error('Hydrate err', err)
        }
    }
    return story
}

// import { fetchLinks } from '@/lib/storyblok'
import { fetchLinks } from '@/lib/storyblok/fetchLinks'
import { sanitizeStoryblokSlugs } from '@/utils/sanitizeStoryblokSlugs'
import { StoryLink } from '@/@types/storyblok'
import RootPage from '../page'

export const revalidate = 3600 // revalidate at most every hour

export { generateMetadata } from '../page'

const NEXT_PUBLIC_DEFAULT_LOCALE = process.env.NEXT_PUBLIC_NEXT_PUBLIC_DEFAULT_LOCALE as string

export async function generateStaticParams() {
    const slugCollection: { locale: string; slug: string[] }[] = []
    const results = await fetchLinks({})
    if (results?.links) {
        /**
         * These links are for the default locale, which is nl-NL in this case.
         * We need to loop over the locales and get the translated versions from the 'alternates'
         * property where we need to look for the 'translated_slug' and 'lang' properties.
         */

        Object.keys(results.links).forEach((key) => {
            const link = results.links[key] as StoryLink
            /**
             * Folders are not pages, so we don't want to generate them into pages. Root stories
             * in folders are the actual content.
             */
            // if (link.is_folder) return
            /**
             * Globals are general content types for the entire site, we don't want them to be
             * generated into pages, thus exclude them from the static params.
             */
            // if (link.slug?.includes('globals')) return
            // const slug = sanitizeStoryblokSlugs(link.slug)
            //     .split('/')
            //     .filter((s) => !!s)
            // // If the slug is emty, it means we're on the root page, return
            // if (slug.length === 0) return
            if (link.is_folder || link.slug?.includes('globals')) return

            const cleanSlug = sanitizeStoryblokSlugs(link.slug).replace('go-celebrate-nl/', '')
            const slug = cleanSlug.split('/').filter((s) => !!s)

            // First, handle stories with the default locale
            slugCollection.push({
                locale: NEXT_PUBLIC_DEFAULT_LOCALE,
                slug,
            })
            // Then iterate ovet the alternates to get the translated slugs for the other locales
            if (link.alternates) {
                /**
                 * Technically, not every story will have a published alternate, but it's not necessary
                 * to check for it, since the page will just throw a notFound in those cases. When,
                 * eventually the translated content gets published, the page will be generated.
                 */
                link.alternates.forEach((alternate) => {
                    const cleanAltSlug = sanitizeStoryblokSlugs(alternate.translated_slug).replace(
                        'go-celebrate-nl/',
                        ''
                    )
                    const alternateSlug = cleanAltSlug.split('/').filter((s) => !!s)
                    slugCollection.push({ locale: alternate.lang, slug: alternateSlug })
                })
            }
        })
    }
    if (process.env.NEXT_PUBLIC_INFO_LOGGING_MODE === 'true') {
        console.log(
            '[generateStaticParams] Static params for content [slug] fetched. Total pages: ',
            slugCollection.length
        )
    }
    return slugCollection
}

export default RootPage

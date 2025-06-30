import { Metadata, ResolvingMetadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { StoryblokComponent } from '@/components/helpers/StoryblokComponent/StoryblokComponent'
// import { fetchStories } from '@/lib/storyblok'
import { fetchStories } from '@/lib/storyblok/fetchStories'
import { generateStoryMetadata } from '@/lib/seo'

import type { PageParams } from '@/@types/globals.d.ts'
import { logWithContext } from '@/utils/logger'

const DEFAULT_LANGUAGE = process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE as string

export async function generateMetadata(props: PageParams): Promise<Metadata> {
    return await generateStoryMetadata(props)
}

export async function generateStaticParams({ params }: { params: any }) {
    if (process.env.NEXT_PUBLIC_INFO_LOGGING_MODE === 'true') {
        console.log('[generateStaticParams] Fetching static params for [locale].')
    }
    const slugCollection: { [key: string]: string | string[] }[] = []
    // Get the root links for a given deployment name.
    const result = await fetchStories({
        // This will result in a single story from the deployment folder.
        slug: [],
        language: DEFAULT_LANGUAGE,
    })

    if (result?.story) {
        slugCollection.push({ locale: DEFAULT_LANGUAGE })

        // Loop over the translated_slugs of the story to check if the content exists in other locales.
        for (const index in result.story.translated_slugs) {
            const storyTranslatedSlug = result.story.translated_slugs[index]
            logWithContext('page.tsx: ', 'Fetching for', storyTranslatedSlug.lang)
            // if (process.env.NEXT_PUBLIC_INFO_LOGGING_MODE === 'true') {
            //     console.log('Fetching for', storyTranslatedSlug.lang)
            // }
            const localeStory = await fetchStories({
                slug: [],
                language: storyTranslatedSlug.lang,
            })
            // logWithContext('page.tsx: ', 'Locale story fetched...')
            // if (process.env.NEXT_PUBLIC_INFO_LOGGING_MODE === 'true') {
            //     console.log('Locale story fetched...')
            // }
            // If a story exist, we support that locale, let's generate the content for it.
            if (localeStory?.story) slugCollection.push({ locale: storyTranslatedSlug.lang })
        }
    }
    logWithContext(
        'page.tsx: ',
        `[generateStaticParams] Static params fetched for ${slugCollection.length} locales: ${slugCollection
            .map((c) => c.locale)
            .join(', ')}.`
    )
    // if (process.env.NEXT_PUBLIC_INFO_LOGGING_MODE === 'true') {
    //     console.log(
    //         `[generateStaticParams] Static params fetched for ${slugCollection.length} locales: ${slugCollection
    //             .map((c) => c.locale)
    //             .join(', ')}.`
    //     )
    // }
    return slugCollection
}

export default async function Home({ params, searchParams }: PageParams) {
    const { locale, slug } = params
    // logWithContext('page.tsx: ', { locale, slug })
    // if (process.env.NEXT_PUBLIC_INFO_LOGGING_MODE === 'true') {
    //     console.log("Page component params:", { locale, slug });
    // }
    /**
     * Automatically return notFound if it looks like a file path was requested as app updates result
     * in a new deployment and the old files are not available anymore.
     */
    if (slug && slug[slug.length - 1].includes('.')) {
        // logWithContext('page.tsx: ', 'File path detected, returning notFound')
        // if (process.env.NEXT_PUBLIC_INFO_LOGGING_MODE === 'true') {
        //     console.log("File path detected, returning notFound");
        // }
        notFound()
    }
    // logWithContext('page.tsx: ', 'Fetching story with params:', {
    //     language: locale,
    //     slug: slug ? slug : [],
    //     resolve_links: 'story',
    // })
    // if (process.env.NEXT_PUBLIC_INFO_LOGGING_MODE === 'true') {
    //     console.log("Fetching story with params:", {
    //         language: locale,
    //         slug: slug ? slug : [],
    //         resolve_links: 'story'
    //     });
    // }
    const { story, error } = await fetchStories({
        language: locale,
        slug: slug ? slug : [],
        resolve_links: 'story',
    })
    if (!story || error) {
        // console.warn('[CONTENT] 🟡 Story not found during export, skipping page:', {
        //     slug,
        //     locale,
        // })

        return (
            <div style={{ padding: 40 }}>
                <h1>Page Coming Soon</h1>
                <p>This content is not yet published.</p>
            </div>
        )
    }

    if (process.env.NEXT_PUBLIC_INFO_LOGGING_MODE === 'true') {
        // console.log('[CONTENT] ✅ Story fetched: ', {
        //     name: story.name,
        //     full_slug: story.full_slug,
        //     component: story.content?.component,
        // })
    }
    return (
        <StoryblokComponent
            blok={story.content}
            story={story}
            locale={locale}
            params={params}
            searchParams={searchParams}
        />
    )
}

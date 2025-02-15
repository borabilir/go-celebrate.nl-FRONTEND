import { Metadata, ResolvingMetadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { StoryblokComponent } from '@/components/helpers/StoryblokComponent/StoryblokComponent'
import { fetchStories } from '@/lib/storyblok'
import { generateStoryMetadata } from '@/lib/seo'

import type { PageParams } from '@/@types/globals.d.ts'

const DEFAULT_LANGUAGE = process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE as string

export async function generateMetadata(props: PageParams): Promise<Metadata> {
    return await generateStoryMetadata(props)
}

export async function generateStaticParams({ params }: { params: any }) {
    console.log('[generateStaticParams] Fetching static params for [locale].')
    const slugCollection: { [key: string]: string | string[] }[] = []
    // Get the root links for a given deployment name.
    const result = await fetchStories({
        // This will result in a single story from the deployment folder.
        slug: [],
    })

    if (result?.story) {
        slugCollection.push({ locale: DEFAULT_LANGUAGE })

        // Loop over the translated_slugs of the story to check if the content exists in other locales.
        for (const index in result.story.translated_slugs) {
            const storyTranslatedSlug = result.story.translated_slugs[index]
            console.log('Fetching for', storyTranslatedSlug.lang)
            const localeStory = await fetchStories({
                slug: [],
                language: storyTranslatedSlug.lang,
            })
            console.log('Locale story fetched...')
            // If a story exist, we support that locale, let's generate the content for it.
            if (localeStory?.story) slugCollection.push({ locale: storyTranslatedSlug.lang })
        }
    }
    console.log(
        `[generateStaticParams] Static params fetched for ${slugCollection.length} locales: ${slugCollection
            .map((c) => c.locale)
            .join(', ')}.`
    )
    return slugCollection
}

export default async function Home({ params, searchParams }: PageParams) {
    const { locale, slug } = params
    /**
     * Automatically return notFound if it looks like a file path was requested as app updates result
     * in a new deployment and the old files are not available anymore.
     */
    if (slug && slug[slug.length - 1].includes('.')) notFound()
    const { story, error } = await fetchStories({
        language: locale,
        slug: slug ? slug : [],
        resolve_links: 'story',
    })
    if (!story || error) {
        console.log('[CONTENT] ❌ Story not found for page', slug)
        if (error) console.error(`[CONTENT] Error: ${error}`)
        notFound()
    }
    console.log('[CONTENT] ✅ Story fetched: ', story.name, story.full_slug)
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

import { Metadata, ResolvingMetadata } from 'next'

// import { fetchStories } from '@/lib/storyblok'
import { fetchStories } from '@/lib/storyblok/fetchStories'
import type { PageParams } from '@/@types/globals.d.ts'

const DEPLOYMENT_NAME = process.env.NEXT_PUBLIC_DEPLOYMENT_NAME as string
const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL as string) || `https://${process.env.VERCEL_URL}`
const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LOCALE as string

export async function generateStoryMetadata(
    { params: { locale, slug }, searchParams }: PageParams,
    parent?: ResolvingMetadata
): Promise<Metadata> {
    const previewToken = null // searchParams['_storyblok_tk[token]'];
    const { story, error } = await fetchStories({
        language: locale,
        // You get the home page by passing an empty array as the slug
        slug: slug || [],
        resolve_links: 'story',
        cv: previewToken ? Date.now() : undefined,
        version: previewToken ? 'draft' : 'published',
    })
    if (!story?.content) {
        return {}
    }
    const languages: any = {}
    // Create alternate links for all locales
    story.translated_slugs?.map((translation) => {
        languages[translation.lang] = `${BASE_URL}/${translation.lang}${translation.path.replace(DEPLOYMENT_NAME, '')}`
    })
    return {
        title: story.content.seo?.title || story.content.title,
        description: story.content.seo?.description,
        openGraph: {
            title: story.content.seo?.title || story.content.title,
            description: story.content.seo?.description,
        },
        alternates: {
            canonical: `${BASE_URL}${DEFAULT_LOCALE === locale ? '' : `/${locale}`}${story.full_slug
                .replace(`${DEPLOYMENT_NAME}`, '')
                .replace(`/${locale}`, '')}`.replace(/\/$/, ''),
            languages,
        },
    }
}

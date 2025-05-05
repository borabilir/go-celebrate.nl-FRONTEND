import Hero from '@/components/blocks/Hero/Hero'
import { BlogPostsGrid } from '@/components/blocks/BlogPostsGrid'
import type { StoryblokPageSeo, StoryblokBlok, Story } from '@/@types/storyblok'
// import { fetchStories } from '@/lib/storyblok.server'
import { fetchStories } from '@/lib/storyblok/fetchStories'
import { logWithContext } from '@/utils/logger'

logWithContext('BlogHome.tsx: ', 'BlogHome component loaded');


export interface BlogHomeProps {
    seo: StoryblokPageSeo
    hero: any[]
}

export async function BlogHome({
    blok,
    story,
    locale,
}: {
    blok: StoryblokBlok<BlogHomeProps>
    story: Story
    locale: string
}) {
    const { hero } = blok
    const { full_slug } = story
    logWithContext('BlogHome.tsx: ', 'process.env.NEXT_PUBLIC_DEPLOYMENT_NAME: ',
        process.env.NEXT_PUBLIC_DEPLOYMENT_NAME);
    logWithContext('BlogHome.tsx: ', 'locale: ', locale);
    const DEPLOYMENT_URL = `${process.env.NEXT_PUBLIC_DEPLOYMENT_NAME}/${locale.toLowerCase()}`
    logWithContext('BlogHome.tsx: ', 'DEPLOYMENT_URL: ', DEPLOYMENT_URL);
    const blogUrl = full_slug.replace(DEPLOYMENT_URL, '') // E.g., /blog/
    logWithContext('BlogHome.tsx: ', 'blogUrl: ', blogUrl);
    const { data: result } = await fetchStories({
        starts_with: full_slug,
    })
    // Make sure to exclude the blog itself from the list of posts
    const posts = result?.stories.filter((story: Story) => story.full_slug !== full_slug) || []
    return (
        <div className="space-y-10 md:space-y-16">
            {hero && hero[0] && <Hero blok={hero[0]} />}
            <BlogPostsGrid
                blok={{
                    blogUrl,
                    posts,
                }}
            />
        </div>
    )
}

import Head from 'next/head'

// The Storyblok Client
import Storyblok, { useStoryblok } from '@/lib/storyblok'
import DynamicComponent from '@/components/DynamicComponent'
import StoryHead from '@/components/seo/StoryHead'

import { hydrateMdmData } from '@/lib/mdm.hydrate'

// import Test from '@/components/Test'

export default function Page({ story, preview }) {
    const enableBridge = true // load the storyblok bridge everywhere
    // const enableBridge = preview; // enable bridge only in prevew mode
    story = useStoryblok(story, enableBridge)

    return (
        <>
            {story && <StoryHead blok={story} />}
            <DynamicComponent blok={story.content} />
        </>
    )
}

export async function getStaticProps({ preview, locale, locales, defaultLocale }) {
    // the slug of the story
    let slug = 'home'
    // the storyblok params
    let params = {
        version: 'draft', // or 'published'
    }

    /**
     * In next.js there isn't a great way to include navbar/footer stuff only once, so here we do that for every page
     */
    const layoutProps = {
        navbar: {},
        footer: {
            legal: '© Go Celebrate Benelux B.V.',
        },
    }

    // checks if Next.js is in preview mode
    if (preview) {
        // loads the draft version
        params.version = 'draft'
        // appends the cache version to get the latest content
        params.cv = Date.now()
    }

    // loads the story from the Storyblok API
    let data

    try {
        let { data: storyBlokData } = await Storyblok.get(
            `cdn/stories/${process.env.NEXT_PUBLIC_DEPLOYMENT_NAME}/${locale.toLowerCase()}/`,
            params
        )
        data = storyBlokData
    } catch (err) {
        console.error(err)
    }

    // Fetch MDM data for components that rely on it
    if (data) {
        data.story = await hydrateMdmData(data?.story, locale)
    }

    // return the story from Storyblok and whether preview mode is active
    return {
        props: {
            story: data ? data.story : false,
            preview: preview || false,
            layoutProps,
            redirect: data
                ? null
                : {
                      destination: '/',
                      permanent: false,
                  },
        },
        revalidate: 3600,
    }
}

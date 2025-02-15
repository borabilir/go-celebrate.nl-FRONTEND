import React from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { hydrateMdmData } from '@/lib/mdm.hydrate'

import Storyblok, { useStoryblok } from '@/lib/storyblok'
import DynamicComponent from '@/components/DynamicComponent'
import StoryHead from '@/components/seo/StoryHead'

import { getLinksForStaticPaths, getStoryForStaticProps } from '@/lib/storyblok.server'

import { getMdmEntityLinksForStaticPaths, getMdmEntityForStaticProps } from '@/lib/mdm.server'

export default function Page({ story, preview }) {
    const enableBridge = true // load the storyblok bridge everywhere
    // const enableBridge = preview; // enable bridge only in prevew mode
    story = useStoryblok(story, enableBridge)

    return (
        <>
            {story && story.__typename !== 'ComponentSharedSeo' && <StoryHead blok={story} />}
            {story ? (
                <DynamicComponent blok={story.content} originalStory={story} />
            ) : (
                <p className="text-center max-w-xl mx-auto pt-16">Hmm... there is no content here. Yet.</p>
            )}
        </>
    )
}

export async function getStaticPaths({ locales }) {
    let paths = []
    /* Fetch StoryBlok content paths */
    const storyblokPaths = await getLinksForStaticPaths(locales)
    if (storyblokPaths && Array.isArray(storyblokPaths)) {
        paths = paths.concat(storyblokPaths)
    }
    /* Fetch paths for e.g., offerings, etc that we want to load directly from MDM */
    const mdmEntityPaths = await getMdmEntityLinksForStaticPaths(locales)
    if (mdmEntityPaths && Array.isArray(mdmEntityPaths)) {
        paths = paths.concat(mdmEntityPaths)
    }
    return {
        paths,
        fallback: false,
    }
}

export async function getStaticProps({ params, locale, preview = false, ...rest }) {
    const DEPLOYMENT_URL = `${process.env.NEXT_PUBLIC_DEPLOYMENT_NAME}/${locale.toLowerCase()}`
    const { slug } = params

    /*
     * Look for the existing pages in storyblok, otherwise try to fetch them from MDM
     */
    let folderRootExtraTrailingSlash = ''
    const storyblokLinksMap = []
    const { data: storyblokLinks } = await Storyblok.get(`cdn/links/?starts_with=${DEPLOYMENT_URL}`, {
        cv: Date.now(),
    })
    // Create a routes for every link
    Object.keys(storyblokLinks.links).forEach((linkKey) => {
        // Do not create a route for folders
        if (
            storyblokLinks.links[linkKey].is_folder ||
            // Do not generate the home page here either
            storyblokLinks.links[linkKey].slug === `${DEPLOYMENT_URL}/`
        ) {
            return
        }
        /*
         * We have a very special case in Storyblok where folders itself don't have trailing slashes
         * while their root page has. It'd result /blog returning nothing since that is for the folder
         * but we still would want to get the page, which is /blog/. To circumvent this, we compare against
         * the trailing slashes too.
         */
        if (storyblokLinks.links[linkKey].slug === `${DEPLOYMENT_URL}/${slug.join('/')}/`) {
            // We need to add an extra /
            folderRootExtraTrailingSlash = '/'
        }
        // Add to our list to check against
        storyblokLinksMap.push(storyblokLinks.links[linkKey].slug)
    })

    let story

    try {
        if (storyblokLinksMap.includes(`${DEPLOYMENT_URL}/${slug.join('/')}${folderRootExtraTrailingSlash}`)) {
            /* Fetch storyblok story */
            story = await getStoryForStaticProps({
                params,
                locale,
                preview,
            })
        } else {
            /**
             * There's no storyblok content, so we'll fetch data from MDM
             *
             * The main idea is that we'll mimick the storyblok concept and create fake blok-s so our components will work nicely
             */
            story = await getMdmEntityForStaticProps({
                slug,
                locale,
            })
        }

        if (story) {
            story = await hydrateMdmData(story, locale)
            return {
                props: {
                    ...(await serverSideTranslations(locale, ['common', 'quote'])),
                    story,
                    preview,
                    /*
                     * Pages must be keyed otherwise stale state can be served upon client-side navigation
                     * See: https://github.com/vercel/next.js/issues/31751
                     */
                    key: `${DEPLOYMENT_URL}-${slug.join('/')}-${story?._uid}`,
                },
                revalidate: 3600, // revalidate every day (3600)
            }
        }
        throw new Error(`Content not found for: ${DEPLOYMENT_URL}/${slug || ''}${folderRootExtraTrailingSlash}`)
    } catch (err) {
        console.error(err)
        return {
            props: {
                notFound: true,
            },
        }
    }
}

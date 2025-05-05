/**
 * This component takes care of rendering the head metatags for any given story
 */

import Head from 'next/head'
import { useRouter } from 'next/router'

// import MiscellaneusHead from '@/components/seo/MiscellaneusHead'
import MiscellaneusHead from '../components/seo/MiscellaneusHead'

// import socialImageUrlBuilder from '@/utils/socialImageUrlBuilder'
import socialImageUrlBuilder from '../utils/socialImageUrlBuilder'

export default function StoryHead({ blok = {} }) {
    const {
        name, // Only use as a last resort fallback!!!!
        published_at,
        content: { component, seo = {} },
    } = blok
    const { locale, asPath } = useRouter()
    const cleanedAsPath = asPath.split(/\#|\?/g)[0]
    const domain = process.env.NEXT_PUBLIC_SITE_DOMAIN
    const optimizedOgImage = socialImageUrlBuilder(seo.og_image)
    const optimizedTwitterImage = socialImageUrlBuilder(seo.twitter_image)
    return (
        <Head>
            <title>{seo.title || 'Go Celebrate'}</title>
            <meta key="description" name="description" content={seo.description} />

            <meta key="og:site_name" property="og:site_name" content="Go Celebrate" />
            <meta key="og:url" property="og:url" content={`https://www.${domain}${cleanedAsPath}`} />
            <link rel="canonical" href={`https://www.${domain}${cleanedAsPath}`}></link>
            <meta key="og:locale" property="og:locale" content={locale} />

            <meta key="og:title" property="og:title" content={seo.og_title || seo.title} />
            <meta key="og:description" property="og:description" content={seo.og_description || seo.description} />

            {component === 'BlogPost' ? (
                <>
                    <meta property="og:type" content="article" />
                    <meta property="article:published_time" content={published_at}></meta>
                </>
            ) : (
                <meta key="og:type" property="og:type" content="website" />
            )}

            {/*
                component === 'BlogPost' -> author, todo: ADD Author field on the BlogPost content type
                <meta property="og:article:author" content="...">
            */}

            {/*
                component === 'BlogHome' -> updated_at should be the publication date of the last article
            */}

            <meta property="og:updated_time" content={published_at} />

            {optimizedOgImage && (
                <>
                    <meta key="og:image" property="og:image" content={optimizedOgImage} />
                    <meta property="og:image:secure_url" content={optimizedOgImage} />
                    <meta key="og:image:width" property="og:image:width" content="1200" />
                    <meta key="og:image:height" property="og:image:width" content="628" />
                </>
            )}

            <meta key="twitter:card" property="twitter:card" content="summary_large_image" />
            <meta
                key="twitter:title"
                property="twitter:title"
                content={seo.twitter_title || seo.og_title || seo.title}
            />
            <meta
                key="twitter:description"
                property="twitter:description"
                content={seo.twitter_description || seo.og_description || seo.description}
            />

            {optimizedTwitterImage && (
                <>
                    <meta key="twitter:image" property="twitter:image" content={optimizedTwitterImage} />
                    <meta key="twitter:image:width" property="twitter:image:width" content="1200" />
                    <meta key="twitter:image:height" property="twitter:image:width" content="628" />
                </>
            )}

            <MiscellaneusHead />
        </Head>
    )
}

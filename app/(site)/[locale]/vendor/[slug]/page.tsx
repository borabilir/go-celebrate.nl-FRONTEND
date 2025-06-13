import { Metadata, ResolvingMetadata } from 'next'
import { getClient } from '@/lib/apollo.server'
import { OfferingDetails } from './components/OfferingDetails'
import OfferingsQuery from '@/apollo/queries/offering/offeringsWithExtendedInfo.gql'
import MinimalOfferingsQuery from '@/apollo/queries/offering/offerings.gql'
import { useServerLocale } from '@hooks/useServerLocale'

export async function generateStaticParams() {
    const languages = process.env.NEXT_PUBLIC_ACTIVE_LANGUAGES?.split(',') || ['nl']
    const slugs: { slug: string }[] = []
    for (const locale of languages) {
        const variables: any = {
            locale,
            pagination: {
                start: 0,
                limit: 10000,
            },
        }
        // const { data } = await getClient().query({ query: MinimalOfferingsQuery, variables })
        // data?.offerings?.data.map((offering: any) => {
        //     slugs.push({ slug: offering.attributes.key })
        // })
    }
    if (process.env.NEXT_PUBLIC_INFO_LOGGING_MODE === 'true') {
        console.log('[generateStaticParams] Static params fetched for', slugs.length, 'slugs.')
    }
    return slugs
}

export async function generateMetadata({ params, searchParams }: any, parent?: ResolvingMetadata): Promise<Metadata> {
    const defaultLocale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'nl'
    const { slug } = params
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { locale } = useServerLocale(params)
    const offering = await getOffering(slug, locale)
    return {
        title: offering?.attributes?.seo?.metaTitle || offering?.attributes?.name,
        description: offering?.attributes?.seo?.metaDescription || '',
        keywords: offering?.attributes?.seo?.metaKeywords || '',
        robots: offering?.attributes?.seo?.metaRobots || '',
        openGraph: {
            title: offering?.attributes?.seo?.metaTitle || offering?.attributes?.name,
            description: offering?.attributes?.seo?.metaDescription || '',
            url: `https://www.${process.env.NEXT_PUBLIC_SITE_DOMAIN}/${
                locale === defaultLocale ? 'vendor/' : `${locale}/vendor/`
            }${offering?.attributes?.key}`,
            type: 'article',
            publishedTime: offering?.attributes?.publishedAt || offering?.attributes?.createdAt,
            modifiedTime: offering?.attributes?.updatedAt,
            images: offering?.attributes?.seo?.metaImage?.data
                ? [
                      {
                          url: offering?.attributes?.seo?.metaImage?.data?.attributes.url || '',
                          width: offering?.attributes?.seo?.metaImage?.data?.attributes.width || 1200,
                          height: offering?.attributes?.seo?.metaImage?.data?.attributes.height || 630,
                          alt: offering?.attributes?.seo?.metaImage?.data?.attributes.alt || '',
                      },
                  ]
                : [],
            siteName: 'Go Celebrate',
        },
    }
}

export default async function OfferingPage({
    params: { locale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'nl', slug },
}: {
    params: { locale: string; slug: string }
}) {
    const offering = await getOffering(slug, locale)
    if (!offering) {
        return <h1>Offering not found</h1>
    }
    return (
        <>
            <OfferingDetails data={offering} />
        </>
    )
}

async function getOffering(slug: string, locale: string) {
    const variables: any = {
        locale,
        filters: {
            slug: {
                eq: slug,
            },
        },
    }
    const { data } = await getClient().query({ query: OfferingsQuery, variables })
    return data?.offerings?.data[0]
}

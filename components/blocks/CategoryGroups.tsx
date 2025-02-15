import Link from 'next/link'
import Image from 'next/legacy/image'

import Section from '@/components/Section'
import Container from '@/components/Container'
import RichText from '@/components/blocks/RichText'
import { mdmApiServer } from '@/lib/mdm.server'

export default async function CategoryGroups({ blok, locale }: any) {
    const defaultLocale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'nl'
    const { text, component, _uid } = blok
    const resolveApi = component === 'CategoryGroups' ? 'category-groups' : 'categories'
    const { data } = await mdmApiServer<{ data: any[]; meta: any }>(resolveApi, {
        locale,
        pagination: {
            start: 0,
            limit: 100,
        },
        sort: 'name:asc',
        populate: ['icon'],
    })
    return (
        <Section>
            <Container>
                {text && <RichText type={text.type} blok={blok} className="mb-8 lg:mb-10 max-w-2xl" />}
                {data?.length > 0 && (
                    <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 gap-4 md:gap-y-6 md:gap-x-8 lg:gap-x-12">
                        {data.map((category) => (
                            <Link
                                key={category.attributes.key + _uid}
                                href={`${locale === defaultLocale ? '' : `/${locale}`}/category-groups/${
                                    category.attributes.slug
                                }`}
                                className="flex items-center gap-3 p-3 md:p-4 text-md lg:text-xl font-medium border border-dark-blue-200 rounded-sm"
                            >
                                {category.attributes.icon?.data ? (
                                    <Image
                                        width="32"
                                        height="32"
                                        unoptimized
                                        src={category.attributes.icon?.data?.attributes?.url}
                                        alt={
                                            category.attributes.icon?.data?.attributes?.alternativeText ||
                                            `Icon of ${category.attributes.name}` ||
                                            ' '
                                        }
                                    />
                                ) : (
                                    <span />
                                )}
                                {category.attributes.name}
                            </Link>
                        ))}
                    </div>
                )}
            </Container>
        </Section>
    )
}

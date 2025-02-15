import Image from 'next/legacy/image'
import Link from 'next/link'

import { FiChevronLeft } from 'react-icons/fi'

import RichText from '@/components/blocks/RichText'
import Section from '@/components/Section'
import Container from '@/components/Container'

export function BlogPost({ blok, story = {}, locale }: any) {
    const { title, cover, seo, content, author } = blok
    const { published_at } = story
    return (
        <>
            <div className="md:grid md:grid-cols-9 sm:mx-6 lg:mx-12 xl:mx-20 mb-12 lg:mb-20">
                <div className="md:col-span-4 md:pb-12 lg:pb-20">
                    <div className="bg-dark-blue-100 md:rounded-l-lg px-6 pt-10 pb-16 lg:px-16 lg:pt-16 lg:pb-32">
                        <Link href="/blog" className="flex items-center font-semibold opacity-50">
                            <FiChevronLeft className="mr-2 w-5 h-5" />
                            Back to articles
                        </Link>
                        <h1 className="heading-1">{title}</h1>
                    </div>
                    {author && author.story && (
                        <div className="-mt-7 px-6 lg:px-16">
                            <div className="relative rounded-full w-14 h-14 md:w-16 md:h-16 mb-3 ring-4 ring-dark-blue-100 border-4 border-white">
                                {author.story.content?.photo?.filename && (
                                    <Image
                                        src={author.story.content.photo.filename}
                                        layout="fill"
                                        className="object-cover rounded-full"
                                        sizes="128px"
                                        alt=""
                                    />
                                )}
                            </div>
                            <div className="flex items-center text-sm font-semibold">
                                <span>
                                    {author.story.content?.firstName} {author.story.content?.lastName}
                                </span>
                                <span className="mx-2">•</span>
                                <span>
                                    {new Date(published_at).toLocaleDateString(locale, {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="md:col-span-5 relative">
                    {cover && cover.filename && (
                        <Image
                            src={cover.filename}
                            priority={true}
                            layout="fill"
                            className="object-cover md:rounded-r-lg"
                            sizes="(min-width: 1280px) calc(55.58vw - 89px), (min-width: 780px) 50vw, (min-width: 640px) calc(100vw - 48px), 100vw"
                            alt=""
                        />
                    )}
                </div>
            </div>
            <Section>
                <Container>{content && <RichText blok={{ text: content }} className="mx-auto max-w-xl" />}</Container>
            </Section>
        </>
    )
}

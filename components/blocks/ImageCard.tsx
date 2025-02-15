import storyblokImageLoader from '@/utils/storyblokImageLoader'
import Image from 'next/legacy/image'
import Link from 'next/link'
import RichText from '@/components/blocks/RichText'
import { StoryblokBlok } from '@/@types/storyblok'

export default function ImageCard({ blok }: { blok: StoryblokBlok<any> }) {
    const { image = {}, title, text, target } = blok || {}
    const {
        url, // Results from Strapi
        filename, // For storyblok rendered components
        alternativeText,
        name, // For storyblok rendered components
    } = image || {}
    const {
        story, // If it is a linked content
        url: targetUrl, // If it is an external url
    } = target
    return (
        <li className="relative aspect-w-4 aspect-h-5 rounded-lg overflow-hidden">
            {(url || filename) && (
                <Image
                    loader={storyblokImageLoader}
                    src={url || filename}
                    alt={alternativeText || name || ' '}
                    layout="fill"
                    className="object-cover"
                    sizes="(min-width: 1520px) 361px, (min-width: 1280px) calc(17.27vw + 102px), (min-width: 1040px) calc(33.18vw - 80px), (min-width: 780px) calc(50vw - 90px), (min-width: 640px) calc(100vw - 82px), calc(100vw - 50px)"
                />
            )}
            <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8 z-20">
                {story || targetUrl ? (
                    <h3 className="heading-3 mt-4 md:mt-6 md:text-center text-white">
                        <Link href={targetUrl || story?.full_slug || '/'} className="block">
                            <span aria-hidden="true" className="absolute inset-0" />
                            {title}
                        </Link>
                    </h3>
                ) : (
                    <h3 className="heading-3 mt-4 md:mt-6 md:text-center text-white">{title}</h3>
                )}
                <RichText blok={blok} className="mt-2 text-white whitespace-pre-wrap" />
            </div>
            <div className="absolute inset-x-0 top-1/2 bottom-0 h-1/2 z-10 bg-gradient-to-t from-default opacity-75" />
        </li>
    )
}

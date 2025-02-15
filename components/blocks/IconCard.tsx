import Image from 'next/legacy/image'
import Link from 'next/link'

import RichText from '@/components/blocks/RichText'
import { StoryblokBlok } from '@/@types/storyblok'

export default function IconCard({ blok }: { blok: StoryblokBlok<any> }) {
    const { icon, title, text, target } = blok || {}
    const {
        story, // If it is a linked content
        url, // If it is an external url
    } = target
    return (
        <li className="relative flex flex-col pt-8 md:pt-10">
            <div className="absolute top-0 left-0 md:left-1/2 transform-gpu -translate-x-3 md:-translate-x-1/2 w-16 h-16 md:w-20 md:h-20 z-10">
                {icon && icon.filename && (
                    <Image alt={icon.alt || 'icon'} src={icon.filename} width={80} height={80} unoptimized />
                )}
            </div>
            <div className="relative flex-grow bg-dark-blue-100 rounded-lg pt-8 md:pt-10 px-6 pb-6 xl:px-8 xl:pb-8">
                {story || url ? (
                    <h3 className="heading-3 mt-4 md:mt-6 md:text-center">
                        <Link href={url || story?.full_slug || '/'} className="block">
                            <span aria-hidden="true" className="absolute inset-0" />
                            {title}
                        </Link>
                    </h3>
                ) : (
                    <h3 className="heading-3 mt-4 md:mt-6 md:text-center">{title}</h3>
                )}
                <RichText className="text-sm lg:text-base mt-3 md:mt-7" blok={blok} />
            </div>
        </li>
    )
}

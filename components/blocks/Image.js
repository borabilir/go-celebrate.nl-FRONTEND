'use client'
// import storyblokImageLoader from '@/utils/storyblokImageLoader'
import storyblokImageLoader from '../utils/storyblokImageLoader'
import Image from 'next/legacy/image'

export default function ImageBlok({
    blok: {
        image: { filename, alt, copyright, focus, id, name, title, width = 100, height = 100 } = {},
        stretchToContent,
    } = {},
}) {
    return (
        <div className="relative">
            {filename && (
                <Image
                    loader={storyblokImageLoader}
                    src={filename}
                    alt={alt || name || ' '}
                    layout={stretchToContent ? 'fill' : undefined}
                    width={stretchToContent ? undefined : width}
                    height={stretchToContent ? undefined : height}
                    className="object-cover rounded md:rounded-lg"
                    sizes="(min-width: 1520px) 361px, (min-width: 1280px) calc(17.27vw + 102px), (min-width: 1040px) calc(33.18vw - 80px), (min-width: 780px) calc(50vw - 90px), (min-width: 640px) calc(100vw - 82px), calc(100vw - 50px)"
                />
            )}
        </div>
    )
}

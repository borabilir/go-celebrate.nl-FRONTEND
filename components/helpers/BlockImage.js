'use client'
/*
    This component leverages Next Image and Story block image optimization
*/

import Image from 'next/legacy/image'

// import storyblokImageLoader from '@/utils/storyblokImageLoader'
import storyblokImageLoader from '../utils/storyblokImageLoader'

export default function BlockImage({ image, className, layout, sizes = '100vw', priority = false }) {
    const {
        filename = '',
        id,
        title = null,
        alt,
        name, // The editor seems to be broken so we use name temporarly as alt field
        width,
        height,
    } = image

    return (
        <Image
            loader={storyblokImageLoader}
            src={filename}
            width={layout === 'fill' ? null : width}
            height={layout === 'fill' ? null : height}
            alt={alt || name || ' '}
            title={title}
            layout={layout || 'responsive'}
            className={className}
            sizes={sizes}
            priority={priority}
        />
    )
}

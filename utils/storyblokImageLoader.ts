import { buildImageUrl, extractPublicId } from 'cloudinary-build-url'

export default function storyblokImageLoader({
    width,
    quality,
    src,
}: {
    width: number
    quality?: number
    src: string
}): string {
    const publicId = extractPublicId(src)
    const url = buildImageUrl(publicId, {
        cloud: {
            cloudName: 'go-celebrate',
        },
        transformations: {
            resize: {
                type: 'scale',
                width: width,
            },
            quality: quality || 75,
        },
    })
    return url
}

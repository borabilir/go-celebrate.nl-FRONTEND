import { buildImageUrl, extractPublicId } from 'cloudinary-build-url'

export default function build(cloudinaryImageUrl) {
    if (!cloudinaryImageUrl) return null
    const ogImagePublicId = extractPublicId(cloudinaryImageUrl.og_image)
    return buildImageUrl(ogImagePublicId, {
        cloud: {
            cloudName: 'go-celebrate',
        },
        transformations: {
            resize: {
                type: 'fill',
                width: 1280,
                height: 628,
            },
        },
    })
}

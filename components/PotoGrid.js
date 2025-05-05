import { useState } from 'react'
import cn from 'classnames'
import Image from 'next/image'

// import storyblokImageLoader from '@/utils/storyblokImageLoader'
import storyblokImageLoader from '../utils/storyblokImageLoader'
// import useWindowSize from '@/hooks/useWindowSize'
import useWindowSize from '../hooks/useWindowSize'

// import Dialog from '@/components/Dialog'
import Dialog from '../components/Dialog'
// import PhotoGridSlider from '@/components/PhotoGridSlider'
import PhotoGridSlider from '../components/PhotoGridSlider'

export default function OfferingsPotoGrid({
    images: { data: images } = {},
    coverPhoto: { data: coverPhoto } = {},
    className,
}) {
    const [open, setOpen] = useState(false)
    const [clickedImageIndex, setClickedImageIndex] = useState(false)
    const { width } = useWindowSize()

    function openFullscreenDialog(index) {
        if (index === undefined) return
        setOpen(true)
        setClickedImageIndex(index)
    }

    let constructImageList
    if (coverPhoto && (coverPhoto.attributes.url || coverPhoto.attributes.filename)) {
        constructImageList = [coverPhoto, ...images]
    } else if (images && images.length > 0) {
        constructImageList = images
    }
    if (!constructImageList || constructImageList.length < 5) {
        if (!constructImageList) constructImageList = []
        // Make sure we render the placeholders
        for (let i = 0; i < 5; i++) {
            if (!constructImageList[i]) constructImageList.push(null)
        }
    }
    return (
        <>
            <div className="relative w-screen sm:w-auto -ml-6 sm:ml-0">
                {
                    /**
                     * The idea is that by default we render the cover image and when the component mounted,
                     * we simply overlay it by the slider. So when the device is slow the user still sees the
                     * full image and once loaded, they can interact with the swiper.
                     */
                    width < 768 && (
                        <div className="absolute inset-0">
                            <PhotoGridSlider
                                images={constructImageList && constructImageList.filter((i) => !!i)}
                                slidesPerView={1}
                                spaceBetween={16}
                                breakpoints={{
                                    768: {
                                        width: 768,
                                        slidesPerView: 2,
                                        spaceBetween: 24,
                                    },
                                }}
                                fill={true}
                            />
                        </div>
                    )
                }
                <div className={cn('grid md:grid-rows-2 md:grid-cols-5 lg:grid-cols-4 gap-2', className)}>
                    {constructImageList &&
                        constructImageList.map((image, index) => {
                            if (index > 4) return
                            return (
                                <div
                                    className={cn(
                                        'aspect-w-4 aspect-h-3 overflow-hidden bg-dark-blue-100',
                                        index === 0 && 'md:col-span-3 lg:col-span-2 md:row-span-2 md:rounded-l-lg',
                                        index === 1 &&
                                            'md:block md:col-span-2 lg:col-span-1 md:rounded-tr-lg lg:rounded-none',
                                        index === 2 &&
                                            'md:block md:col-span-2 lg:col-span-1 md:rounded-br-lg lg:rounded-tr-lg',
                                        index === 4 && 'lg:rounded-br-lg',
                                        index > 0 && 'hidden lg:block'
                                    )}
                                    key={`${image?.id}-${index}`}
                                >
                                    {image && (
                                        <Image
                                            src={image.attributes.url || image.attributes.filename}
                                            alt={image.attributes.alternativeText || image.attributes.name || ' '}
                                            fill={true}
                                            className="object-cover cursor-pointer"
                                            sizes="(min-width: 1520px) 361px, (min-width: 1280px) calc(17.27vw + 102px), (min-width: 1040px) calc(33.18vw - 80px), (min-width: 780px) calc(50vw - 90px), (min-width: 640px) calc(100vw - 82px), calc(100vw - 50px)"
                                            onClick={() => openFullscreenDialog(index)}
                                            priority={index === 0}
                                        />
                                    )}
                                </div>
                            )
                        })}
                </div>
            </div>
            <div>
                <Dialog open={open} setOpen={setOpen} full className="flex items-center">
                    <PhotoGridSlider
                        initialSlide={clickedImageIndex || 0}
                        images={constructImageList && constructImageList.filter((i) => !!i)}
                        slidesPerView={1}
                        spaceBetween={16}
                    />
                </Dialog>
            </div>
        </>
    )
}

import Image from 'next/image'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import cn from 'classnames'

import Slider from '@/components/Slider'

export default function PhotoGridSlider({
    images = [],
    slidesPerView,
    spaceBetween,
    fill,
    initialSlide = 0,
    breakpoints,
    onImageClick = (props) => {},
}) {
    function renderImage(image, index) {
        const sizeProperties = {}
        if (!fill) {
            sizeProperties.width = image.attributes.width
            sizeProperties.height = image.attributes.height
        }
        return (
            <Image
                src={image.attributes.url || image.attributes.filename}
                alt={image.attributes.alternativeText || image.attributes.name || ' '}
                className={cn('cursor-pointer', fill ? 'object-cover' : 'object-contain')}
                priority={initialSlide === index}
                {...sizeProperties}
                onClick={() => onImageClick({ image, index })}
                fill={fill}
            />
        )
    }

    return (
        <div className="relative w-full">
            <div className="navigationPrev absolute flex items-center justify-center top-1/2 left-0 w-10 h-10 bg-dark-blue-200 bg-opacity-75 z-10 transform-gpu -translate-y-1/2 rounded-r cursor-pointer">
                <ChevronLeftIcon className="w-6 h-6" />
            </div>
            <div className="navigationNext absolute flex items-center justify-center top-1/2 right-0 w-10 h-10 bg-dark-blue-200 bg-opacity-75 z-10 transform-gpu -translate-y-1/2 rounded-l cursor-pointer">
                <ChevronRightIcon className="w-6 h-6" />
            </div>
            <Slider
                className="bg-white"
                initialSlide={initialSlide}
                slidesPerView={slidesPerView}
                spaceBetween={spaceBetween}
                breakpoints={breakpoints}
                pagination={{ type: 'fraction' }}
                navigation={{
                    prevEl: '.navigationPrev',
                    nextEl: '.navigationNext',
                }}
                loop={false}
                slideClassName={fill && 'aspect-w-4 aspect-h-3 overflow-hidden'}
            >
                {images
                    .filter((i) => !!i)
                    .map((image, index) => {
                        return <div key={index}>{renderImage(image, index)}</div>
                    })}
            </Slider>
        </div>
    )
}

/*
    This component delays hydration for itself until it is in the viewport.
    This reduces the main thread work so we get better Lighthouse scores.
*/
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation, Keyboard } from 'swiper/modules'
import cn from 'classnames'

function SliderComponent({
    children,
    slidesPerView,
    spaceBetween,
    breakpoints,
    pagination,
    navigation,
    loop,
    initialSlide = 0,
    className,
    slideClassName,
}) {
    return (
        <Swiper
            modules={[Pagination, Navigation, Keyboard]}
            initialSlide={initialSlide}
            pagination={pagination}
            navigation={navigation}
            loop={loop}
            slidesPerView={slidesPerView}
            spaceBetween={spaceBetween}
            breakpoints={breakpoints}
            keyboard={{
                enabled: true,
                onlyInViewport: false,
            }}
            className={cn('items-stretch', className)}
        >
            {children &&
                children.map((child, index) => {
                    return (
                        <SwiperSlide
                            className={cn('flex items-center justify-center', slideClassName && slideClassName)}
                            style={{ display: 'flex' }}
                            key={index}
                        >
                            {child}
                        </SwiperSlide>
                    )
                })}
        </Swiper>
    )
}

export default SliderComponent

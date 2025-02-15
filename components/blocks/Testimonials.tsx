'use client'
import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation, Keyboard } from 'swiper/modules'
import cn from 'classnames'

import Section from '@/components/Section'
import Container from '@/components/Container'
import Testimonial from '@/components/atoms/Testimonial'
import { StoryblokBlok } from '@/@types/storyblok'

export default function Testimonials({ blok }: { blok: StoryblokBlok<any> }) {
    const { title, testimonials = [], delay = 7000 } = blok
    const [swiper, setSwiper] = useState<any>()
    const [currentSlide, setCurrentSlide] = useState(0)
    const goToSlide = (index: number) => swiper?.slideTo(index + 1)
    return (
        <Section>
            <Container>
                <div className="max-w-xl mx-auto sm:text-center">
                    {title && <h2 className="heading-2 mb-12 md:mb-16">{title}</h2>}
                </div>
                {testimonials && testimonials.length > 0 && (
                    <div className="bg-dark-blue text-white md:rounded-lg py-12 md:py-20 px-6 -mx-6 sm:mx-0">
                        <div className="max-w-3xl mx-auto">
                            <Swiper
                                autoplay={{
                                    delay,
                                    pauseOnMouseEnter: true,
                                }}
                                autoHeight={true}
                                modules={[Pagination, Navigation, Keyboard]}
                                loop={true}
                                slidesPerView={1}
                                spaceBetween={64}
                                keyboard={{
                                    enabled: true,
                                    onlyInViewport: true,
                                }}
                                onSlideChange={({ realIndex }) => setCurrentSlide(realIndex)}
                                onSwiper={setSwiper}
                                className={cn('items-stretch')}
                            >
                                {testimonials.map((testimonial: StoryblokBlok<any>) => (
                                    <SwiperSlide className="p-6 cursor-grab" key={testimonial._uid}>
                                        <Testimonial blok={testimonial} list />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                        {testimonials && testimonials.length > 0 && (
                            <div className="flex gap-2 max-w-3xl mx-auto px-6 mt-6">
                                {testimonials.map((testimonial: StoryblokBlok<any>, index: number) => (
                                    <div
                                        key={`dot-${testimonial._uid}`}
                                        onClick={(e) => goToSlide(index)}
                                        tabIndex={0}
                                        role="button"
                                        aria-label={`Go to slide ${index + 1}`}
                                        className={cn(
                                            'h-2 rounded-3xl bg-white transition-all cursor-pointer',
                                            index === currentSlide ? 'w-4' : 'w-2 opacity-50'
                                        )}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </Container>
        </Section>
    )
}

import cn from 'classnames'
import slugify from 'slugify'
import Image from 'next/image'

import Section from '@/components/Section'
import Container from '@/components/Container'
import BlockImage from '@/components/helpers/BlockImage'
import RichText from '@/components/blocks/RichText'
import { StoryblokBlok } from '@/@types/storyblok'

export default function SplitTextImage({ blok, story, locale }: StoryblokBlok<any>) {
    const { title, subTitle, text, images, layout = '1_1', reverse, decoration_option } = blok
    // We allow only certain image combinations for 1, 3 and 5 images
    var imageGridLayoutElements = 1
    switch (true) {
        case images?.length > 1 && images?.length < 4:
            imageGridLayoutElements = 3
            break
        case images?.length > 3:
            imageGridLayoutElements = 5
            break
    }
    return (
        <Section className="md:py-8">
            {(title || subTitle) && (
                <Container className="md:text-center mb-6 md:mb-0 lg:mb-12">
                    {title && (
                        <h2 id={slugify(title)} className="heading-2 max-w-800 mx-auto">
                            {title}
                        </h2>
                    )}
                    {subTitle && <p className="lead mt-4">{subTitle}</p>}
                </Container>
            )}
            <Container
                className={cn(
                    'space-y-16 lg:space-y-0 lg:grid md:py-12',
                    layout === '1_1' && 'lg:grid-cols-2 lg:gap-10 xl:gap-20',
                    layout === '1_2' && 'lg:grid-cols-3 lg:gap-10 xl:gap-16'
                )}
            >
                <RichText
                    className={cn('md:py-6 self-center', layout === '1_2' && 'lg:col-span-1')}
                    blok={blok}
                    story={story}
                    locale={locale}
                />
                <div
                    className={cn(
                        'relative grid gap-3 md:gap-4 lg:gap-6 h-72 sm:h-96 lg:h-auto',
                        layout === '1_2' && 'lg:col-span-2',
                        reverse && 'order-first',
                        imageGridLayoutElements > 1 && imageGridLayoutElements < 4 && 'grid-cols-2 grid-rows-6',
                        imageGridLayoutElements > 3 && 'grid-cols-2 grid-rows-9'
                    )}
                >
                    {[...Array(imageGridLayoutElements)].map((__, index) => {
                        if (!images) return
                        const image = images[index]
                        return (
                            <div
                                className={cn(
                                    'relative bg-dark-blue-200 rounded-lg overflow-hidden z-10',
                                    // This is ugly here but Tailwing purger needs it here
                                    imageGridLayoutElements === 3 &&
                                        cn(
                                            index === 0 && 'row-start-1 row-end-3',
                                            index === 1 && 'row-start-3 row-end-7',
                                            index === 2 && 'col-start-2 col-end-3 row-start-1 row-end-7'
                                        ),
                                    imageGridLayoutElements === 5 &&
                                        cn(
                                            index === 0 && 'row-start-1 row-end-4',
                                            index === 1 && 'row-start-4 row-end-6',
                                            index === 2 && 'row-start-6 row-end-10',
                                            index === 3 && 'row-start-1 row-end-5 col-start-2 col-end-3',
                                            index === 4 && 'row-start-5 row-end-10 col-start-2 col-end-3'
                                        )
                                )}
                                key={index}
                            >
                                {image && image.filename && (
                                    <BlockImage
                                        image={image}
                                        layout="fill"
                                        // @ts-ignore
                                        sizes={['100vw', '(min-width: 768px) 50vw']}
                                        className="object-cover z-10"
                                    />
                                )}
                            </div>
                        )
                    })}
                    <div
                        className={cn(
                            'absolute inset-y-3 lg:-inset-y-8 xl:-bottom-16 xl:-inset-y-16 w-full md:w-96 z-0 bg-dark-blue-100 rounded-lg transform-gpu translate-y-8 lg:translate-y-0',
                            reverse
                                ? '-left-4 lg:-translate-x-12 xl:-translate-x-20'
                                : '-right-4 lg:translate-x-12 xl:translate-x-20'
                        )}
                    />
                    <Image
                        fill
                        className={cn(
                            'absolute -bottom-10 z-10',
                            reverse ? '-left-4 md:-left-6 lg:-left-10' : '-right-4 md:-right-6 lg:-right-10'
                        )}
                        src={`/images/confetti/image-decorator-option-${decoration_option || 1}.svg`}
                        alt="confetti"
                    />
                </div>
            </Container>
        </Section>
    )
}

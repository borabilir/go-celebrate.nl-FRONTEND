import cn from 'classnames'

import Container from '@/components/Container'
import BlockImage from '@/components/helpers/BlockImage'
import RichText from '@/components/blocks/RichText'

import type { HeroBlokProps } from './types'

export default function Hero({ blok }: { blok: HeroBlokProps }) {
    const { title, tagline, backgroundImage, fullWidth, content, backgroundColor } = blok
    const hasBackgroundImage = backgroundImage?.filename
    const ContainerComponent = fullWidth ? 'div' : Container
    return (
        <div
            className={cn(
                'relative rounded-t-none rounded-b-none sm:rounded-b-lg sm:mx-6 xl:mx-20 px-4 md:px-10 lg:px-10',
                hasBackgroundImage ? (tagline || content ? 'py-12 md:py-20' : 'py-12 md:py-20 lg:py-44') : '',
                backgroundColor === 'dark-blue' && !hasBackgroundImage ? 'text-white bg-dark-blue' : '',
                backgroundColor === 'light-fog' && !hasBackgroundImage ? 'bg-dark-blue-50' : '',
                backgroundColor === 'light-blue' && !hasBackgroundImage ? 'bg-light-blue' : '',
                backgroundColor === 'rose' && !hasBackgroundImage ? 'bg-classic-rose' : '',
                backgroundColor === 'green' && !hasBackgroundImage ? 'bg-green text-white' : ''
            )}
        >
            <ContainerComponent
                className={cn(
                    hasBackgroundImage ? 'py-10' : 'py-16 md:py-24 -mb-6 md:-mb-10',
                    (backgroundColor || hasBackgroundImage) && 'px-3 xl:px-0'
                )}
            >
                <div
                    className={cn(
                        'relative z-10',
                        hasBackgroundImage ? 'max-w-2xl rounded-r text-white' : fullWidth ? 'max-w-4xl' : 'max-w-3xl'
                    )}
                >
                    <h1
                        className={cn(
                            'relative text-4xl lg:text-5xl lg:leading-tight font-title font-bold',
                            tagline && 'mb-4'
                        )}
                    >
                        {title || 'Add your title'}
                    </h1>
                    {tagline && <p className="text-lg leading-6 md:text-2xl font-medium">{tagline}</p>}
                    {content && <RichText className="mt-3" blok={{ text: content as any }} />}
                </div>
                {hasBackgroundImage && (
                    <div className="absolute inset-y-0 inset-x-0 overflow-hidden md:rounded-b">
                        <div className="relative h-full w-full">
                            <BlockImage
                                image={backgroundImage}
                                className="object-cover object-center w-full h-full"
                                layout="fill"
                                priority={true}
                                sizes="(min-width: 1280px) calc(50vw - 80px), (min-width: 780px) calc(50vw - 48px)"
                            />
                        </div>
                        <div className="absolute inset-0 bg-[#091b2b] lg:bg-transparent bg-none lg:bg-gradient-to-r from-[#091b2b] via-[#091b2b] opacity-60"></div>
                    </div>
                )}
            </ContainerComponent>
        </div>
    )
}

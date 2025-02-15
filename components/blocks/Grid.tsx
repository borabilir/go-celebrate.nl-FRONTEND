import slugify from 'slugify'
import cn from 'classnames'
// @ts-ignore
import { StoryblokComponent } from '@storyblok/react/rsc'

import Section from '@/components/Section'
import Container from '@/components/Container'

export default function Grid({ blok: { title, blocks = [], layout } = {} as any, locale, story }: any) {
    return (
        <>
            <Section>
                {title && (
                    <Container className="md:text-center mb-6 md:mb-0 lg:mb-12 xl:mb-20">
                        {title && (
                            <h2 id={slugify(title)} className="heading-2">
                                {title}
                            </h2>
                        )}
                    </Container>
                )}
                <Container>
                    <div
                        className={cn(
                            'grid max-w-800 lg:max-w-none mx-auto gap-6',
                            layout === 'col_col' && 'lg:grid-cols-2 lg:gap-8 xl:gap-10',
                            layout === 'col_col_col' && 'lg:grid-cols-3 xl:gap-8',
                            layout === 'col_col_col_col' && 'md:grid-cols-2 lg:grid-cols-4'
                        )}
                    >
                        {blocks &&
                            blocks.map((blok: any) => (
                                <StoryblokComponent key={blok._uid} blok={blok} story={story} locale={locale} />
                            ))}
                    </div>
                </Container>
            </Section>
        </>
    )
}

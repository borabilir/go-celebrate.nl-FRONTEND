import cn from 'classnames'

import Section from '@/components/Section'
import Container from '@/components/Container'
import RichText from '@/components/blocks/RichText'

export default function Text({ blok }) {
    const {
        align,
        // This never evaluates to true but we use it to trick tailwind to include classes that are implicitly set from our CMS
        helper
    } = blok
    return (
        <Section>
            <Container
                className={cn('flex', align === 'center' && 'justify-center', align === 'right' && 'justify-end')}
            >
                <RichText
                    className={cn('max-w-800 flex-grow', helper && 'md:text-left', helper && 'md:text-center', helper && 'md:text-right', helper && 'inline-block' )}
                    blok={blok}
                />
            </Container>
        </Section>
    )
}
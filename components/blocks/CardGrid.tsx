import cn from 'classnames'
import Section from '@/components/Section'
import Container from '@/components/Container'
import { StoryblokComponent } from '../helpers/StoryblokComponent'
import { StoryblokBlok } from '@/@types/storyblok'

export default function StepCards({ blok, ...params }: StoryblokBlok<any>) {
    const { cards, title, subTitle } = blok
    return (
        <Section>
            <Container>
                {title && <h2 className="heading-2 text-center">{title}</h2>}
                {subTitle && <p className="lead mt-3 text-center">{subTitle}</p>}
                {(title || subTitle) && <div className="mb-6 md:mb-12"></div>}
                <ul
                    className={cn(
                        'grid md:grid-cols-2 gap-4 md:gap-6 xl:gap-8',
                        !(title || subTitle) && 'py-12',
                        cards?.length > 3 ? 'xl:grid-cols-4' : 'xl:grid-cols-3'
                    )}
                >
                    {cards?.map((step: any) => (
                        <StoryblokComponent blok={step} key={step._uid} {...params} />
                    ))}
                </ul>
            </Container>
        </Section>
    )
}

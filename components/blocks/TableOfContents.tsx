import Section from '@/components/Section'
import Container from '@/components/Container'

import TableOfContentLink from '@/components/atoms/TableOfContentLink'
import { StoryblokBlok } from '@/@types/storyblok'

export default function TableOfContents({ blok }: { blok: StoryblokBlok<any> }) {
    const { title, links } = blok
    return (
        <Section>
            <Container>
                <div className="rich-text border border-dark-blue-200 p-4 md:p-6 max-w-800 mx-auto">
                    <p className="heading-4 opacity-60 mb-4">{title}</p>
                    {links && (
                        <ol className="list ordered ml-6 space-y-1">
                            {links.map((link: any) => (
                                <TableOfContentLink blok={link} key={link._uid} />
                            ))}
                        </ol>
                    )}
                </div>
            </Container>
        </Section>
    )
}

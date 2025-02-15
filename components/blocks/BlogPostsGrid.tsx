import { BlogCard } from '@/components/blocks/BlogCard'
import Section from '@/components/Section'
import Container from '@/components/Container'

export interface BlogPostGridProps {
    blogUrl: string
    posts: any[]
}

export function BlogPostsGrid({ blok }: { blok: BlogPostGridProps }) {
    const { posts = [], blogUrl } = blok
    console.log(blogUrl)
    return (
        <Section>
            <h2 className="sr-only">Articles</h2>
            <Container className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
                {posts?.map((post) => {
                    const { content = {}, slug } = post
                    const { cover = {} } = content
                    return (
                        <BlogCard
                            key={post.id}
                            title={content.title}
                            excerpt={content.excerpt}
                            thumbnail={cover && cover.filename ? cover : null}
                            target={`${blogUrl}${slug}`}
                        />
                    )
                })}
            </Container>
        </Section>
    )
}

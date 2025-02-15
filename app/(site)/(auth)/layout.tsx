import Section from '@/components/Section'
import Container from '@/components/Container'
export default function AuthLayout({ children, params }: { children: React.ReactNode; params: any }) {
    return (
        <div className="bg-dark-blue-50 py-24 sm:py-32 lg:py-48">
            <Section>
                <Container className="flex justify-center">{children}</Container>
            </Section>
        </div>
    )
}

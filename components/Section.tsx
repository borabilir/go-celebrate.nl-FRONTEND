export default function Section({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <section className={`mx-2 sm:mx-6 md:mx-12 xl:mx-20 px-4 md:px-6 lg:px-10 rounded-lg ${className}`}>
            {children}
        </section>
    )
}

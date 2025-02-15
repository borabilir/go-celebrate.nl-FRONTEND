export default function AndchorScroll({
    children,
    href = '',
    className,
}: {
    children: React.ReactNode
    href: string
    className?: string
}) {
    function handleClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        const el = document.getElementById(href.replace('#', ''))
        e.preventDefault()
        el && el.scrollIntoView({ behavior: 'smooth' })
    }
    return (
        <a className={className} href={href} onClick={handleClick}>
            {children}
        </a>
    )
}

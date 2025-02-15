import LinkWrapper from '@/components/helpers/LinkWrapper'

export default function LinkGroup({
    title,
    links = {},
    className
}) {
    return (
        <div className={className}>
            {title && <h3 className="heading-3 opacity-60 mb-4">{ title }</h3>}
            <ul
                className="space-y-2"
            >
                {
                    links.map((link, index) => <li key={link._uid || index}>
                        <LinkWrapper
                            href={link?.link?.cached_url}
                            className="font-semibold"
                        >
                            {link.label}
                        </LinkWrapper>
                    </li>)
                }
            </ul>
        </div>
    )
}
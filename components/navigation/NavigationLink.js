import cn from 'classnames'
import LinkWrapper from '@/components/helpers/LinkWrapper'

export default function NavigationLink({ link, className }) {
    return (
        <LinkWrapper
            key={link._uid}
            href={link.link?.cached_url}
            className={cn('text-base font-medium text-gray-500 hover:text-gray-900', className)}
        >
            {link.label}
        </LinkWrapper>
    )
}

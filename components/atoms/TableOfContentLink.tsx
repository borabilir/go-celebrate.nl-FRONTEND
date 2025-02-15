import cn from 'classnames'
import Style from '@/styles/blocks/_table-of-content-link.module.scss'
import { StoryblokBlok } from '@/@types/storyblok'

export default function TableOfContentLink({ blok, nested }: { blok: StoryblokBlok<any>; nested?: boolean }) {
    const { target, text, children } = blok
    return (
        <li className={cn('text-link', Style['table-of-content-link'], nested && Style.nested)}>
            <a href={`#${target}`}>{text}</a>
            {children && (
                <ol className="list ordered pt-1">
                    {children.map((child: StoryblokBlok<any>) => (
                        <TableOfContentLink blok={child} key={child._uid} nested={true} />
                    ))}
                </ol>
            )}
        </li>
    )
}

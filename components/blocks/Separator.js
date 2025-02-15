import cn from 'classnames'
import Styles from '@/styles/blocks/_separator.module.scss'

export default function Separator({ blok }) {
    const {
        dense
    } = blok
    return (
        <div className={cn(
            'mt-0 mb-0 mx-6 sm:mx-6 px-4 md:px-6 lg:px-10 border-b border-x-dark-blue-100',
            dense && Styles.separator,
            dense ? 'max-w-xs md:mx-auto' : 'md:mx-12 xl:mx-20'
        )}></div>
    )
}
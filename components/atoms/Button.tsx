import cn from 'classnames'

import LinkWrapper from '@/components/helpers/LinkWrapper'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { BiLoaderAlt } from 'react-icons/bi'

export default function Button({ blok = {}, loading, children, className, onClick, disabled, type: buttonType }: any) {
    const { target, label, type, dense, variant, block, prepend, append } = blok
    if (target) {
        return (
            <LinkWrapper
                href={
                    target?.url
                        ? `${target.url}`
                        : target.story
                        ? `${target.story.full_slug}`
                        : target.cached_url
                        ? target.cached_url
                        : target
                }
                target={target.linktype === 'url' ? '_blank' : null}
                className={cn(
                    'font-title font-medium rounded-sm hover:opacity-90 lg:text-lg tracking-wide no-underline',
                    !(type === 'tertiary' || variant === 'tertiary')
                        ? dense
                            ? 'py-3 px-6 md:px-10'
                            : 'py-4 px-6 md:px-10'
                        : '', // Do not apply padding for tertiary
                    block ? 'flex' : 'inline-flex',
                    (type === 'primary' || variant === 'primary') && 'bg-carmin-red text-white shadow',
                    (type === 'primaryAlt' || variant === 'primaryAlt') && 'bg-dark-blue text-white shadow',
                    (type === 'secondary' || variant === 'secondary') && 'bg-dark-blue-100',
                    type === 'tertiary' || variant === 'tertiary'
                        ? 'bg-transparent text-carmin-red'
                        : 'items-center justify-center text-center',
                    className
                )}
            >
                {children || label}
                {(type === 'tertiary' || variant === 'tertiary') && (
                    <ChevronRightIcon className="w-5 h-5 mt-1.5 ml-2" />
                )}
            </LinkWrapper>
        )
    } else {
        return (
            <button
                onClick={(e) => !disabled && onClick && onClick(e)}
                className={cn(
                    'relative font-title font-medium rounded-sm hover:opacity-90 lg:text-lg tracking-wide no-underline',
                    !(type === 'tertiary' || variant === 'tertiary')
                        ? dense
                            ? `py-3 ${!children ? 'px-3 md:px-6' : 'px-6 md:px-10'}`
                            : `py-4 ${!children ? 'px-3 md:px-6' : 'px-6 md:px-10'}`
                        : '', // Do not apply padding for tertiary
                    block ? 'flex' : 'inline-flex',
                    (type === 'primary' || variant === 'primary') && 'bg-carmin-red text-white shadow',
                    (type === 'primaryAlt' || variant === 'primaryAlt') && 'bg-dark-blue text-white shadow',
                    (type === 'secondary' || variant === 'secondary') && 'bg-dark-blue-100',
                    type === 'tertiary' || variant === 'tertiary'
                        ? 'bg-transparent text-carmin-red'
                        : 'items-center justify-center text-center',
                    disabled && 'pointer-events-none grayscale opacity-70',
                    className
                )}
                type={buttonType}
            >
                {prepend && <span className={cn('block', !children && 'py-0.5')}>{prepend}</span>}
                {children || label}
                {(type === 'tertiary' || variant === 'tertiary') && (
                    <ChevronRightIcon className="w-5 h-5 mt-1.5 ml-2" />
                )}
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-400 rounded-sm">
                        <BiLoaderAlt className="text-white w-6 h-6 animate-spin" />
                    </div>
                )}
            </button>
        )
    }
}

import { Fragment } from 'react'
import cn from 'classnames'
import { Popover, Transition } from '@headlessui/react'
import { BiChevronDown } from 'react-icons/bi'
import LinkWrapper from '@/components/helpers/LinkWrapper'
import RichText from '@/components/blocks/RichText'

export default function FlyOutMenu({ item = {} }) {
    return (
        <Popover.Group className="">
            <Popover>
                {({ open }) => (
                    <>
                        <Popover.Button className="flex items-center gap-x-1 text-base font-medium text-center text-gray-500 group hover:text-gray-900">
                            {({ open }) => (
                                <>
                                    {item.label}
                                    <BiChevronDown
                                        className={cn(
                                            'h-6 w-6 flex-none text-gray-400 group-hover:text-gray-900',
                                            open && ' rotate-180'
                                        )}
                                        aria-hidden="true"
                                    />
                                </>
                            )}
                        </Popover.Button>
                        <div
                            className={cn(
                                'lg:absolute lg:inset-x-0 lg:bottom-0 lg:translate-y-full z-50 bg-white lg:shadow-lg lg:ring-1 lg:ring-gray-900/5',
                                open ? 'opacity-100' : 'opacity-0 pointer-events-none -z-50 h-0'
                            )}
                        >
                            {item.content && (
                                <div className="pt-6 max-w-7xl mx-auto lg:px-8">
                                    <RichText blok={{ text: item.content }} />
                                </div>
                            )}
                            <div
                                className={cn(
                                    'lg:mx-auto grid lg:max-w-7xl gap-6 py-10 lg:px-8 xl:gap-x-8',
                                    item.linkGroups.length > 1 && 'md:grid-cols-2',
                                    item.linkGroups.length === 3 && 'lg:grid-cols-3',
                                    item.linkGroups.length > 3 && 'lg:grid-cols-4'
                                )}
                            >
                                {item.linkGroups?.map((linkGroup) => (
                                    <div key={linkGroup._uid}>
                                        <h2 className="text-base mb-3 font-semibold text-gray-500">
                                            {linkGroup.title}
                                        </h2>
                                        {linkGroup.links?.length > 1 && (
                                            <ul className="space-y-2">
                                                {linkGroup.links.map((link) => (
                                                    <li key={link._uid}>
                                                        <LinkWrapper
                                                            className="hover:underline text-carmin-red text-sm"
                                                            key={link._uid}
                                                            href={link.link?.cached_url || '/'}
                                                        >
                                                            {link.label}
                                                        </LinkWrapper>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </Popover>
        </Popover.Group>
    )
}

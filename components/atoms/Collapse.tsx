'use client'
import cn from 'classnames'
import { Disclosure } from '@headlessui/react'
import { FiChevronDown } from 'react-icons/fi'

import RichText from '@/components/blocks/RichText'
import { StoryblokBlok } from '@/@types/storyblok'

export default function Collapse({ blok }: { blok: StoryblokBlok<any> }) {
    const { title = 'Title', body } = blok || {}
    return (
        <div className="border border-dark-blue-200 rounded">
            <Disclosure>
                {({ open }) => (
                    <>
                        <Disclosure.Button className="flex items-center justify-between w-full px-4 py-2 md:px-6 md:py-3 font-semibold text-lg text-left focus:outline-none focus:ring-1 focus:ring-light-blue focus:ring-opacity-75">
                            <span>{title}</span>
                            <FiChevronDown className={cn('w-5 h-5', open && 'transform rotate-180')} />
                        </Disclosure.Button>
                        <Disclosure.Panel className="p-4 md:p-6 border-t border-dark-blue-200 mt-0">
                            {body && <RichText blok={{ text: body }} />}
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
        </div>
    )
}

'use client'
import { useSession } from 'next-auth/react'
import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { usePathname } from 'next/navigation'
import Image from 'next/legacy/image'

import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

import LinkWrapper from '@/components/helpers/LinkWrapper'
import FlyOutMenu from '@/components/navigation/FlyOutMenu'
import NavigationLink from '@/components/navigation/NavigationLink'
import SearchButton from '@/components/SearchButton'
import NavUser from '@/components/NavUser'

export function Navbar({ globals }) {
    const pathname = usePathname()
    const { navbarLinks = [] } = globals
    const { data: userData, status } = useSession()
    return (
        <header className="relative text-default font-sans">
            <Popover className="relative bg-white">
                <div className="flex justify-between items-center mx-4 sm:mx-6 lg:mx-12 xl:mx-20 py-4 lg:py-6 lg:justify-start lg:space-x-10 border-b border-dark-blue-100">
                    <div className="flex justify-start lg:w-0 lg:flex-1">
                        <LinkWrapper href="/" className="flex-shrink-0 w-32 sm:w-36 lg:w-40">
                            <span className="sr-only">Go-Celebrate</span>
                            <Image
                                unoptimized
                                src="/go-celebrate-logo.svg"
                                alt="Go-Celebrate Logo"
                                width="122"
                                height="20"
                                layout="responsive"
                            />
                        </LinkWrapper>
                        <a
                            className="absolute z-50 left-1/2 -top-6 transform-gpu -translate-x-1/2 -translate-y-full py-3 px-6 text-xl bg-default text-white opacity-0 focus:opacity-100 focus:translate-y-0"
                            href="#main"
                        >
                            Skip to main content
                        </a>
                    </div>
                    <div className="flex items-center -mr-2 -my-2 lg:hidden">
                        <LinkWrapper
                            href={`/get-quote?_r=${pathname || ''}`}
                            className="block mr-2 pt-1.5 pb-2 px-4 bg-carmin-red rounded text-white font-medium text-sm"
                        >
                            Get a quote
                        </LinkWrapper>
                        <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-dark-blue-200-500">
                            <span className="sr-only">Open menu</span>
                            <Bars3Icon className="h-6 w-6 stroke-2" aria-hidden="true" />
                        </Popover.Button>
                    </div>
                    <Popover.Group as="nav" className="hidden lg:flex items-center">
                        <ul className="space-x-6 flex items-center">
                            {navbarLinks.map((item) => (
                                <li key={item._uid}>
                                    {item.component === 'NavigationLink' && <NavigationLink link={item} />}
                                    {item.component === 'FlyOutMenu' && <FlyOutMenu item={item} />}
                                </li>
                            ))}
                        </ul>
                        <SearchButton className="ml-2 text-gray-500 hover:text-gray-900" />
                        <div className="w-px h-8 -my-1 mx-4 bg-gray-300"></div>
                        <div className="flex items-center space-x-5">
                            {status === 'authenticated' ? (
                                <NavUser user={userData?.user} />
                            ) : (
                                <NavigationLink link={{ label: 'Sign in', link: { cached_url: '/sign-in' } }} />
                            )}
                            <LinkWrapper
                                href={`/book?_r=${pathname || ''}`}
                                className="block pt-1.5 pb-2 px-6 bg-carmin-red rounded text-white font-medium"
                            >
                                Boek nu
                            </LinkWrapper>
                        </div>
                    </Popover.Group>
                </div>

                <Transition
                    as={Fragment}
                    enter="duration-200 ease-out"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="duration-100 ease-in"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <Popover.Panel
                        focus
                        className="absolute z-30 top-0 inset-x-0 p-2 transition transform origin-top-right lg:hidden"
                    >
                        <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
                            <div className="py-5 px-5">
                                <div className="flex items-center justify-between">
                                    <LinkWrapper href="/" className="flex-shrink-0 w-32 sm:w-36 lg:w-40">
                                        <span className="sr-only">Go-Celebrate</span>
                                        <Image
                                            unoptimized
                                            src="/go-celebrate-logo.svg"
                                            alt="Go-Celebrate Logo"
                                            width="122"
                                            height="20"
                                            layout="responsive"
                                        />
                                    </LinkWrapper>
                                    <div className="-mr-2">
                                        <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-dark-blue-200-500">
                                            <span className="sr-only">Close menu</span>
                                            <XMarkIcon className="h-6 w-6 stroke-2" aria-hidden="true" />
                                        </Popover.Button>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <nav className="grid gap-4">
                                        {navbarLinks.map((item) => (
                                            <Fragment key={item._uid}>
                                                {item.component === 'NavigationLink' && (
                                                    <Popover.Button className="text-left">
                                                        <NavigationLink link={item} />
                                                    </Popover.Button>
                                                )}
                                                {item.component === 'FlyOutMenu' && <FlyOutMenu item={item} />}
                                            </Fragment>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                            <div className="py-6 px-5">
                                <div className="mt-6">
                                    <LinkWrapper
                                        href={`/get-quote?_r=${pathname || ''}`}
                                        className="flex items-center justify-center pt-1.5 pb-2 px-6 bg-carmin-red rounded text-white font-medium"
                                    >
                                        Get a quote
                                    </LinkWrapper>
                                </div>
                            </div>
                        </div>
                    </Popover.Panel>
                </Transition>
            </Popover>
        </header>
    )
}

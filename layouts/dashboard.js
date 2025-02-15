import Head from 'next/head'
import cn from 'classnames'
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BiMenu, BiBell, BiX } from 'react-icons/bi'

import Image from 'next/image'
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import DashboardNavigation from '@/components/dashboard/Navigation'
import LinkWrapper from '@/components/helpers/LinkWrapper'
import SearchPrompt from '@/components/SearchPrompt'

import { useState } from 'react'
import { useMantineTheme } from '@mantine/core'

const user = {
    name: 'Tom Cook',
    email: 'tom@example.com',
    imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}

const userNavigation = [
    { name: 'Your Profile', href: '#' },
    { name: 'Settings', href: '#' },
    { name: 'Sign out', href: '#' },
]

export default function Default({ children, globals, ...rest }) {
    const theme = useMantineTheme()
    const [opened, setOpened] = useState(false)
    return (
        <>
            <Head>
                {typeof window !== 'undefined' && (
                    <link key="canonical" rel="canonical" href={document.location.toString()} />
                )}
                <link rel="icon" href="/favicon.ico" />
                <link rel="dns-prefetch" href="//go-celebrate.com" />
                <link rel="preload" href="/fonts/RebrandDisMedium/font.woff2" as="font" crossOrigin="" />
                <link rel="preload" href="/fonts/RebrandDisBold/font.woff2" as="font" crossOrigin="" />
                <link rel="preload" href="/fonts/RebrandTxtRegular/font.woff2" as="font" crossOrigin="" />
                <link rel="preload" href="/fonts/RebrandTxtMedium/font.woff2" as="font" crossOrigin="" />
                <meta key="og:type" property="og:type" content="website" />
                {typeof window !== 'undefined' && (
                    <meta key="og:url" property="og:url" content={document.location.toString()} />
                )}
                <meta key="og:og:site_name" property="og:og:site_name" content="Go Celebrate" />
            </Head>
            <Navbar globals={globals} user={user} />
            <main id="main" className="flex w-full text-default font-sans">
                {children}
            </main>
            <Footer globals={globals} />
            <SearchPrompt />
        </>
    )
}

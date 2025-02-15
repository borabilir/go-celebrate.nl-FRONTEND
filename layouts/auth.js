import { NotificationsProvider } from '@mantine/notifications'

import Head from 'next/head'
import Image from 'next/image'

import LinkWrapper from '@/components/helpers/LinkWrapper'

export default function Auth({ children, globals, ...rest }) {
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
            <NotificationsProvider>
                <div className="flex min-h-screen">
                    <main
                        id="main"
                        className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 text-default lg:text-lg font-sans"
                    >
                        <div className="mx-auto w-full max-w-sm lg:w-96">
                            <header className="mb-8 md:mb-10">
                                <LinkWrapper href="/" className="block w-32 sm:w-36 lg:w-40">
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
                            </header>
                            {children}
                        </div>
                    </main>
                    <div className="relative hidden w-0 flex-1 lg:block">
                        <Image
                            className="absolute inset-0 h-full w-full object-cover"
                            layout="fill"
                            src="https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
                            alt="Sign in"
                        />
                    </div>
                </div>
            </NotificationsProvider>
        </>
    )
}

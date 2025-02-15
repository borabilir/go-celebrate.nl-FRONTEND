import { NotificationsProvider } from '@mantine/notifications'

import Head from 'next/head'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'

export default function Default({ children, globals, ...rest }) {
    return (
        <>
            <Head>
                {
                    typeof window !== "undefined" && <link key="canonical" rel="canonical" href={document.location.toString()} />
                }
                <link rel="icon" href="/favicon.ico" />
                <link rel='dns-prefetch' href='//go-celebrate.com' />
                <link rel="preload" href="/fonts/RebrandDisMedium/font.woff2" as="font" crossOrigin="" />
                <link rel="preload" href="/fonts/RebrandDisBold/font.woff2" as="font" crossOrigin="" />
                <link rel="preload" href="/fonts/RebrandTxtRegular/font.woff2" as="font" crossOrigin="" />
                <link rel="preload" href="/fonts/RebrandTxtMedium/font.woff2" as="font" crossOrigin="" />
                <meta key="og:type" property="og:type" content="website" />
                {
                    typeof window !== "undefined" && <meta key="og:url" property="og:url" content={document.location.toString()} />
                }
                <meta key="og:og:site_name" property="og:og:site_name" content="Go Celebrate" />
            </Head>
            <header className="text-default font-sans">
                <div className="flex mx-4 sm:mx-6 lg:mx-12 xl:mx-20 py-4 lg:py-6 lg:justify-start lg:space-x-10 border-b border-dark-blue-100">
                    <div className="flex-shrink-0 mx-auto w-32 sm:w-36 lg:w-40">
                        <Image
                            unoptimized
                            src="/go-celebrate-logo.svg"
                            alt="Go-Celebrate Logo"
                            width="122"
                            height="20"
                            layout="responsive"
                        />
                    </div>
                </div>
            </header>
            <NotificationsProvider>
                <main
                    id="main"
                    className='text-default lg:text-lg font-sans'
                >
                    {children}
                </main>
            </NotificationsProvider>
            <Footer globals={globals} />
        </>
    )
}
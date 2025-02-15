import Head from 'next/head'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SearchPrompt from '@/components/SearchPrompt'

export default function Default({ children, globals, ...rest }) {
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
            <Navbar globals={globals} />
            <main id="main" className="text-default font-sans">
                {children}
            </main>
            <Footer globals={globals} />
            <SearchPrompt />
        </>
    )
}

import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import * as globals from '@/cache/globals.json'
import { NextAuthProvider } from '@/components/providers/Session'
import { SWRProvider } from '@/components/providers/SWR'
import { useServerLocale } from '@hooks/useServerLocale'
// import { initStoryblok } from '@/lib/storyblok'
import { initStoryblok } from '@/lib/storyblok/initStoryblok'

import 'swiper/css'

initStoryblok()

export const revalidate = 3600

export default function SiteLayout({ children, params }: { children: React.ReactNode; params: any }) {
    const { locale } = useServerLocale(params)

    console.log('[Server Layout] locale:', locale)

    return (
        <>
            <NextAuthProvider>
                <SWRProvider>
                    <Navbar globals={extractLocalGloblas(globals, locale)} />
                    {children}
                    <Footer globals={extractLocalGloblas(globals, locale)} />
                </SWRProvider>
            </NextAuthProvider>
        </>
    )
}

const extractLocalGloblas = (globals: any, locale: string) => {
    const { [locale]: localeGlobals } = globals
    console.log('[Server Layout] globals:', localeGlobals)

    return localeGlobals?.content
}

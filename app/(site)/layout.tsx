import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import globals from '@/cache/globals.json'
import { NextAuthProvider } from '@/components/providers/Session'
import { SWRProvider } from '@/components/providers/SWR'
import { useServerLocale } from '@hooks/useServerLocale'
import { initStoryblok } from '@/lib/storyblok'

import 'swiper/css'

initStoryblok()

export const revalidate = 1

export default function SiteLayout({ children, params }: { children: React.ReactNode; params: any }) {
    const { locale } = useServerLocale(params)
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
    return localeGlobals?.content
}

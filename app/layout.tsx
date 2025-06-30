import '@/styles/tailwind.scss'
import '@/styles/global.scss'

import cn from 'classnames'
import { Poppins } from 'next/font/google'

import { ApolloWrapper } from '@/lib/apollo.wrapper'

// @ts-ignore
import { storyblokInit, apiPlugin } from '@storyblok/react/rsc'
// @ts-ignore
import StoryblokBridgeLoader from '@storyblok/react/bridge-loader'

import EmotionProvider from '@/components/providers/Emotion'
import { initStoryblok } from '@/lib/storyblok'

initStoryblok();

const poppins = Poppins({
    weight: ['400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-poppins',
})

export default function RootLayout({
    children,
    params: { locale },
}: {
    children: React.ReactNode
    params: { locale: string }
}) {
    const locales = process.env.NEXT_PUBLIC_ACTIVE_LANGUAGES?.split(',') || ['nl']
    if (!locales.includes(locale)) {
        locale = 'nl'
    }
    return (
        <html lang={locale}>
            {}
            <head>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#10484C" />
                <meta name="msapplication-TileColor" content="#10484c" />
                <meta name="theme-color" content="#141C3D" />
            </head>
            <body className={cn(poppins.className, poppins.variable)}>
                <EmotionProvider>
                    <ApolloWrapper>{children}</ApolloWrapper>
                </EmotionProvider>
            </body>
            <StoryblokBridgeLoader />
        </html>
    )
}

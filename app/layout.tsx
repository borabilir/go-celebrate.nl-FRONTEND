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
// Components import
import Page from '@/components/Page'
import Button from '@/components/atoms/Button'
import HomeHero from '@/components/blocks/HomeHero'
import SplitTextImage from '@/components/blocks/SplitTextImage'
import CategoryGroups from '@/components/blocks/CategoryGroups'
import Categories from '@/components/blocks/Categories'
import { OfferingsGrid } from '@/components/blocks/OfferingsGrid'
import Hero from '@/components/blocks/Hero/Hero'
import Text from '@/components/blocks/Text'
import CardGrid from '@/components/blocks/CardGrid'
import IconCard from '@/components/blocks/IconCard'
import ImageCard from '@/components/blocks/ImageCard'
import GetQuote from '@/components/blocks/GetQuote'
import { BlogPostsGrid } from '@/components/blocks/BlogPostsGrid'
import LogoGrid from '@/components/blocks/LogoGrid'
import TableOfContents from '@/components/blocks/TableOfContents'
import Separator from '@/components/blocks/Separator'
import Testimonials from '@/components/blocks/Testimonials'
import Grid from '@/components/blocks/Grid'
import BlokImage from '@/components/blocks/Image'
import RichText from '@/components/blocks/RichText'
import Collapse from '@/components/atoms/Collapse'

import { BlogHome } from '@/components/blocks/BlogHome'
import { BlogPost } from '@/components/blocks/BlogPost'

storyblokInit({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
    use: [apiPlugin],
    components: {
        page: Page,
        Button,
        HomeHero,
        SplitTextImage,
        CategoryGroups,
        Categories,
        OfferingsGrid,
        Hero,
        Text,
        CardGrid,
        IconCard,
        ImageCard,
        GetQuote,
        BlogHome,
        BlogPostsGrid,
        BlogPost,
        LogoGrid,
        TableOfContents,
        Separator,
        Testimonials,
        Grid,
        Image: BlokImage,
        RichText,
        Collapse,
    },
})

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

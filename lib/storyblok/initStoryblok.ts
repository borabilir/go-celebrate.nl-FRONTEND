import { storyblokInit, apiPlugin } from '@storyblok/react/rsc'
import dynamic from 'next/dynamic'

const OfferingList = dynamic(() => import('@/components/OfferingList'))

import { BlogHome } from '@/components/blocks/BlogHome'
import { OfferingsGrid } from '@/components/blocks/OfferingsGrid'
import Page from '@/components/Page'
const HomeHero = dynamic(() => import('@/components/blocks/HomeHero'))
const SplitTextImage = dynamic(() => import('@/components/blocks/SplitTextImage'))
const CategoryGroups = dynamic(() => import('@/components/blocks/CategoryGroups'))
const Categories = dynamic(() => import('@/components/blocks/Categories'))
const Hero = dynamic(() => import('@/components/blocks/Hero/Hero'))
const Text = dynamic(() => import('@/components/blocks/Text'))
const CardGrid = dynamic(() => import('@/components/blocks/CardGrid'))
const IconCard = dynamic(() => import('@/components/blocks/IconCard'))
const ImageCard = dynamic(() => import('@/components/blocks/ImageCard'))
const GetQuote = dynamic(() => import('@/components/blocks/GetQuote'))
import { BlogPostsGrid } from '@/components/blocks/BlogPostsGrid'
const LogoGrid = dynamic(() => import('@/components/blocks/LogoGrid'))
const TableOfContents = dynamic(() => import('@/components/blocks/TableOfContents'))
const Separator = dynamic(() => import('@/components/blocks/Separator'))
const Testimonials = dynamic(() => import('@/components/blocks/Testimonials'))
const Grid = dynamic(() => import('@/components/blocks/Grid'))
const Image = dynamic(() => import('@/components/blocks/Image'))
const RichText = dynamic(() => import('@/components/blocks/RichText'))
const Collapse = dynamic(() => import('@/components/atoms/Collapse'))
import Button from '@/components/atoms/Button'

export const initStoryblok = ({ excludeComponents }: { excludeComponents?: boolean } = {}) =>
    storyblokInit({
        accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
        use: [apiPlugin],
        // @ts-ignore
        components: excludeComponents
            ? undefined
            : {
                  HomeHero,
                  SplitTextImage,
                  CategoryGroups,
                  Categories,
                  Hero,
                  Text,
                  CardGrid,
                  IconCard,
                  ImageCard,
                  GetQuote,
                  OfferingList,
                  BlogHome,
                  BlogPostsGrid,
                  LogoGrid,
                  TableOfContents,
                  Separator,
                  Testimonials,
                  Grid,
                  Image,
                  RichText,
                  Button,
                  Collapse,
                  Page,
                  OfferingsGrid,
              },
    })

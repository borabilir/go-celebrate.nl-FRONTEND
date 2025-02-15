import { BlokImage } from '@/@types/storyblok'

export interface HeroBlokProps {
    _uid: string
    title: string
    subtitle: string
    image: BlokImage
    tagline: string
    backgroundImage: BlokImage
    fullWidth: boolean
    content: string
    backgroundColor: string
}

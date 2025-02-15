// @ts-ignore
import { StoryblokComponent } from '@storyblok/react/rsc'
// @ts-ignore
import type { GenericPageBlok, StoryblokBlok } from '@types/storyblok'

export default function Page({ blok, locale }: { blok: GenericPageBlok; locale: string }) {
    return (
        <div className="space-y-16 lg:space-y-24">
            {blok?.body?.map((blok: StoryblokBlok<any>) => (
                <StoryblokComponent blok={blok} key={blok._uid} locale={locale} />
            ))}
        </div>
    )
}

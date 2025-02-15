'use client'
import { OfferingsGrid } from '@/components/blocks/OfferingsGrid'
import { StoryblokComponent } from './helpers/StoryblokComponent'

export default function OfferingList({ blok, ...params }: any) {
    return (
        <div className="space-y-16 lg:space-y-24">
            {blok.hero && blok.hero[0] && (
                <StoryblokComponent blok={{ ...blok.hero[0], fullWidth: true }} {...params} />
            )}
            <OfferingsGrid
                blok={{
                    data: blok.data,
                    categories_filter: blok.categories_filter,
                    fullWidth: true,
                }}
            />
            {blok.body
                ? blok.body.map((blok: any) => <StoryblokComponent blok={blok} key={blok._uid} {...params} />)
                : null}
        </div>
    )
}

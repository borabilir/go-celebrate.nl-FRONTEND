import storyblokImageLoader from '@/utils/storyblokImageLoader'
import Image from 'next/legacy/image'
import Link from 'next/link'

export function BlogCard({ offering = {}, title, excerpt, categories, target, thumbnail = {}, className }: any) {
    // Do the necessary image optimizations
    const { url, filename, width, height, alternativeText } = thumbnail || {}
    return (
        <div className="relative border border-dark-blue-100 rounded-lg overflow-hidden">
            <div className="block aspect-w-16 aspect-h-10 bg-dark-blue-50">
                {(url || filename) && (
                    <Image
                        // loader={storyblokImageLoader}
                        src={url || filename}
                        alt={title}
                        layout="fill"
                        className="object-cover"
                        sizes="(min-width: 1520px) 361px, (min-width: 1280px) calc(17.27vw + 102px), (min-width: 1040px) calc(33.18vw - 80px), (min-width: 780px) calc(50vw - 90px), (min-width: 640px) calc(100vw - 82px), calc(100vw - 50px)"
                    />
                )}
            </div>
            <div className="px-8 py-6">
                <h3>
                    <Link
                        href={target.startsWith('/') ? target : `/${target}`}
                        className="block font-title text-lg md:text-xl leading-6 font-bold"
                    >
                        {/* This trick elevates the anchor tag to cover the whole card. */}
                        <span aria-hidden="true" className="absolute inset-0" />
                        {title}
                    </Link>
                </h3>
                {excerpt && <p className="mt-2 md:mb-8 text-sm md:text-base">{excerpt}</p>}
                {categories && categories.length > 0 && (
                    <div className="flex gap-y-2 gap-x-4 md:gap-x-6 flex-wrap mt-6">
                        {categories.map((category: any) => (
                            <Link
                                key={category.id}
                                href={category.attributes.key}
                                className="text-sm md:text-base font-medium opacity-50"
                            >
                                {category.attributes.name}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

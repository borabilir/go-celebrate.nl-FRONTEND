import cn from 'classnames'
import Image from 'next/image'
import Link from 'next/link'

export default function OfferingCard({
    offering = {
        attributes: {},
    },
    className,
}: {
    offering: any
    className?: string
}) {
    const { name: title, excerpt, categories, key: target, coverPhoto, vendor } = offering.attributes
    // Do the necessary image optimizations
    const { url, filename, alternativeText } = coverPhoto?.data?.attributes || {}

    const { name: vendorName, key: vendorKey, logo } = vendor?.data?.attributes || {}
    const { url: vendorLogoUrl, alternativeText: vendorLogoalternativeText } = logo?.data?.attributes || {}
    return (
        <div
            className={cn(
                'relative flex flex-col border border-dark-blue-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:ring-2 hover:ring-dark-blue hover:ring-opacity-5 transition-all hover:bg-gray-50 focus-within:shadow-md focus-within:ring-2 focus-within:ring-dark-blue focus-within:ring-opacity-5',
                className
            )}
        >
            <div className="block aspect-w-16 aspect-h-10 bg-dark-blue-50">
                {(url || filename) && (
                    <Image
                        src={url || filename}
                        alt={alternativeText || title}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1520px) 361px, (min-width: 1280px) calc(17.27vw + 102px), (min-width: 1040px) calc(33.18vw - 80px), (min-width: 780px) calc(50vw - 90px), (min-width: 640px) calc(100vw - 82px), calc(100vw - 50px)"
                    />
                )}
            </div>
            <div className="flex flex-col grow px-4 xl:px-8 py-6">
                {vendorLogoUrl && (
                    <div className="relative w-16 h-16 -mt-14 mb-4 border-2 shadow border-white rounded-full overflow-hidden">
                        <Image
                            src={vendorLogoUrl}
                            alt={vendorLogoalternativeText || `${vendorName} logo`}
                            fill
                            className="object-cover"
                            sizes="64px"
                        />
                    </div>
                )}
                <h3>
                    <Link
                        href={`/vendor/${target.replace('/', '')}`}
                        className="block font-title text-lg md:text-xl leading-6 font-bold truncate outline-none focus:ring-2 focus:ring-link focus:ring-offset-4 focus:ring-opacity-40 rounded-sm"
                        target="_blank"
                    >
                        {/* This trick elevates the anchor tag to cover the whole card. */}
                        <span aria-hidden="true" className="absolute inset-0" />
                        {title}
                    </Link>
                </h3>
                {excerpt && (
                    <p
                        className="mt-2 text-sm md:text-base md:h-[48px]"
                        style={{
                            WebkitLineClamp: 2,
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {excerpt}
                    </p>
                )}
                {categories?.data && categories.data.length > 0 && (
                    <div className="flex gap-2 items-end grow mt-4">
                        <div className="px-2 py-1 rounded border border-dark-blue-100 text-sm font-medium text-gray-500 bg-dark-blue-50 truncate">
                            {categories.data[0].attributes.name}
                        </div>
                        {categories.data.length > 1 && (
                            <div className="w-7 h-7 rounded-full flex items-center justify-center font-semibold text-gray-500 text-xs border border-dark-blue-100 bg-dark-blue-50">
                                +{categories.data.length - 1}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

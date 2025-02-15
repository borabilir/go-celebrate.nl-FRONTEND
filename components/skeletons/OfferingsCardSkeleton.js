import { Skeleton } from '@mantine/core'
export default function OfferingsCardSkeleton({}) {
    return (
        <div className='border border-dark-blue-100 rounded overflow-hidden'>
            <div className="relative block aspect-w-16 aspect-h-10 bg-dark-blue-50">
                <Skeleton className='absolute w-full h-full' />
            </div>
            <div className="px-4 xl:px-8 py-6">
                <div className="relative w-16 h-16 -mt-14 mb-4 border-2 shadow border-white rounded-full overflow-hidden bg-dark-blue-50">
                <Skeleton circle height={64} width={64} />
                </div>
                <Skeleton height={28} />
                <Skeleton className='mt-2' height={48} />
                <Skeleton className='mt-4' height={28} />
            </div>
        </div>
    )
}
import cn from 'classnames'
import { useTranslation } from 'next-i18next'
import Image from "next/legacy/image"
import { useRouter } from 'next/router'
import { Skeleton } from '@mantine/core'

import { FiCheck } from 'react-icons/fi'

export default function EventPreview({
    offerings = [],
    occasion,
    startDate,
    endDate,
    className,
}) {
    const { t, i18n } = useTranslation(['common', 'quote'])
    const { query } = useRouter()
    return (
        <>
            <div className={cn(className, 'space-y-4 md:space-y-6')}>
                {query.offering && !offerings && (
                    <div className="relative block aspect-w-16 aspect-h-10 bg-dark-blue-100">
                        <Skeleton className="w-full h-full" />
                    </div>
                )}
                {offerings.length > 0 &&
                    offerings.map((offering) => (
                        <div
                            key={offering.id}
                            className="relative block aspect-w-16 aspect-h-10 bg-dark-blue-100 rounded overflow-hidden"
                        >
                            {offering.attributes.coverPhoto &&
                                offering.attributes.coverPhoto.data && (
                                    <Image
                                        src={
                                            offering.attributes.coverPhoto.data
                                                .attributes.url
                                        }
                                        alt={offering.attributes.name}
                                        className="object-cover"
                                        layout="fill"
                                    />
                                )}
                            <div className="absolute inset-0 flex flex-col justify-end p-3 md:p-4 z-20 md:text-lg font-semibold text-white">
                                {offering.attributes.name}
                            </div>
                            <div className="absolute inset-x-0 top-1/4 bottom-0 h-3/4 z-10 bg-gradient-to-t from-default opacity-75" />
                        </div>
                    ))}
                <div>
                    {occasion && (
                        <div className="font-bold mb-2">
                            {occasion.attributes.name}
                        </div>
                    )}
                    {query._o && !occasion && (
                        <Skeleton className="w-32 h-7 mb-2" />
                    )}
                    {startDate && (
                        <div className="font-bold mb-2">
                            {startDate.toLocaleDateString()}
                            {endDate && (
                                <>
                                    <span className="mx-2">-</span>
                                    {endDate.toLocaleDateString()}
                                </>
                            )}
                        </div>
                    )}
                </div>
                <div className="border border-dark-blue-200 rounded p-4 md:p-5">
                    <h3 className="text-lg font-semibold mb-3">
                        {t('book_sidebar_title', { ns: 'quote' })}
                    </h3>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-start">
                            <div className="shrink-0 mt-0.5 mr-2 bg-green p-1 rounded-full text-white">
                                <FiCheck />
                            </div>
                            {t('book_sidebar_point_1', { ns: 'quote' })}
                        </li>
                        <li className="flex items-start">
                            <div className="shrink-0 mt-0.5 mr-2 bg-green p-1 rounded-full text-white">
                                <FiCheck />
                            </div>
                            {t('book_sidebar_point_2', { ns: 'quote' })}
                        </li>
                        <li className="flex items-start">
                            <div className="shrink-0 mt-0.5 mr-2 bg-green p-1 rounded-full text-white">
                                <FiCheck />
                            </div>
                            {t('book_sidebar_point_3', { ns: 'quote' })}
                        </li>
                        <li className="flex items-start">
                            <div className="shrink-0 mt-0.5 mr-2 bg-green p-1 rounded-full text-white">
                                <FiCheck />
                            </div>
                            {t('book_sidebar_point_4', { ns: 'quote' })}
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

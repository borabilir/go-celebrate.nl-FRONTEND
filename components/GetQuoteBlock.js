'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useQuery } from '@apollo/client'
import { useTranslation } from '@i18n/client'

import dayjs from 'dayjs'
import 'dayjs/locale/nl'

import OccasionsQuery from '@/apollo/queries/occasion/occasionsList.gql'

import Button from '@/components/atoms/Button'
import { Select } from '@/components/design-system/Select'
import { DateInput } from '@/components/design-system/DateInput'

export default function GetQuoteBlock({ offering = {} }) {
    const { locale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'nl' } = useParams()
    const { t } = useTranslation(locale, ['common', 'quote'])
    const { id } = offering
    const [occasion, setOccasion] = useState()

    const {
        data: { occasions } = {},
        loading,
        error,
    } = useQuery(OccasionsQuery, {
        variables: {
            locale,
            pagination: { limit: 1000 },
            sort: 'order',
        },
    })

    let now = dayjs().set('millisecond', 0).set('second', 0).set('minute', 0).set('hour', 0)

    now = now.add(7, 'day')

    const [startDate, setStartDate] = useState(now.toDate())
    const [endDate, setEndDate] = useState()

    let tomorrow = dayjs(now.toDate()).add(1, 'day').toDate()
    if (startDate) {
        tomorrow = dayjs(dayjs(startDate).add(1, 'day').toDate()).toDate()
    }

    const toOfferingQuery = {
        offering: id,
        _o: occasion,
        _start: startDate ? startDate.toISOString() : undefined,
    }
    if (endDate) {
        toOfferingQuery._end = endDate.toISOString()
    } else if (!endDate && toOfferingQuery._end) {
        delete toOfferingQuery._end
    }

    return (
        <div className="p-4 lg:p-8 bg-dark-blue-100 rounded-lg z-10 sticky top-0">
            <h2 className="heading-3 mb-3 relative z-10">Book now</h2>
            <p className="text-sm mb-5 relative z-10">
                Tell us about your event to get a quote from The Poffertjesman and other suppliers on Go-Celebrate.
            </p>
            <div className="bg-white rounded-md shadow mb-2">
                <Select
                    data={occasions ? occasions.data : []}
                    value={occasion}
                    onChange={setOccasion}
                    trackedBy="attributes.key"
                    labelledBy="attributes.name"
                    ghost
                    placeholder={t('what_is_the_occasion', { ns: 'quote' })}
                    size="xl"
                />
                <div className="border-t border-dark-blue-200">
                    <div className="sm:flex sm:items-stretch md:block xl:flex">
                        <div className="flex-1 flex-grow pl-3 pr-0 md:pl-4 pb-2 md:pb-2 pt-1 md:pt-2">
                            <div className="text-xs">{t('start_date', { ns: 'quote' })}</div>
                            <DateInput
                                valueFormat="DD, MMM YYYY"
                                placeholder="Choose date"
                                value={startDate}
                                onChange={setStartDate}
                                clearable={false}
                                classNames={{
                                    root: 'font-sans',
                                    wrapper: 'font-sans',
                                    cell: 'font-sans',
                                    label: 'md:text-base font-semibold',
                                    input: 'font-sans text-base py-5 border-dark-blue-200 border-none px-0',
                                }}
                            />
                        </div>
                        <div className="border-b sm:border-b-0 sm:border-l md:border-b md:border-l-0 xl:border-b-0 xl:border-l border-dark-blue-200"></div>
                        <div className="flex-1 flex-grow pl-3 pr-0 md:pl-4 pb-2 md:pb-2 pt-1 md:pt-2">
                            <div className="text-xs">{t('end_date', { ns: 'quote' })}</div>
                            <DateInput
                                valueFormat="DD, MMM YYYY"
                                placeholder={t('one_day_event', { ns: 'quote' })}
                                value={endDate}
                                onChange={setEndDate}
                                minDate={tomorrow}
                                classNames={{
                                    root: 'font-sans',
                                    wrapper: 'font-sans',
                                    cell: 'font-sans',
                                    label: 'md:text-base font-semibold',
                                    input: 'font-sans text-base py-5 border-dark-blue-200 border-none px-0',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Link
                href={{ pathname: '/book', query: { offering: id } }}
                className="inline-flex font-semibold underline mb-6"
            >
                Ik weet nog niet precies
            </Link>
            <Button
                className="relative z-10"
                blok={{
                    target: { pathname: '/book', query: toOfferingQuery },
                    label: 'Get quote',
                    type: 'primary',
                    dense: true,
                    block: true,
                }}
            />
            <div className="absolute -bottom-3 -right-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 68" width="78" height="68">
                    <g fill="none" fillRule="evenodd">
                        <path
                            d="M69.28.61C63.172 6.72 55.048 9.917 46.404 9.613h-.005a30.954 30.954 0 0 1-3.998-.4l-1.893 11.407c1.813.3 3.66.486 5.489.549 11.713.41 23.18-4.102 31.459-12.381L69.28.61"
                            fill="#F3A712"
                        />
                        <path
                            d="M34.493 55.656c-8.638 0-16.643-3.484-22.541-9.81l-.003-.004a30.985 30.985 0 0 1-2.544-3.11L0 49.458a42.539 42.539 0 0 0 3.493 4.27c7.992 8.573 19.292 13.49 31 13.49h.001V55.656h-.001Z"
                            fill="#FBCAEF"
                        />
                    </g>
                </svg>
            </div>
            <div className="absolute -top-4 -left-8">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 104" width="100" height="104">
                    <g fill="none" fillRule="evenodd">
                        <path
                            d="M88.764 5.274C85.809 13.39 79.798 19.72 71.834 23.1l-.003.002c-1.226.52-2.502.967-3.793 1.326l3.105 11.139a42.539 42.539 0 0 0 5.207-1.822C87.14 29.167 95.625 20.23 99.63 9.228L88.764 5.273Z"
                            fill="#85C7F2"
                        />
                        <path
                            d="M63.858 67.492C60.903 75.61 54.89 81.94 46.928 85.32l-.003.001c-1.226.52-2.502.968-3.794 1.327l3.106 11.139a42.539 42.539 0 0 0 5.207-1.822c10.79-4.578 19.275-13.515 23.28-24.517l-10.866-3.955Z"
                            fill="#FBCAEF"
                        />
                        <path
                            d="M36.59 35.964c-7.83-3.65-13.612-10.191-16.283-18.418l-.002-.004a30.985 30.985 0 0 1-.99-3.895L7.946 15.77a42.539 42.539 0 0 0 1.361 5.346c3.62 11.148 11.784 20.38 22.395 25.328l4.887-10.48Z"
                            fill="#197278"
                        />
                    </g>
                </svg>
            </div>
        </div>
    )
}

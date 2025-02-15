'use client'
import cn from 'classnames'
import { atom, useAtom } from 'jotai'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useTranslation } from '@i18n/client'
import useSWRInfinite from 'swr/infinite'

import { FiSearch } from 'react-icons/fi'

import Button from '@/components/atoms/Button'
import Section from '@/components/Section'
import Container from '@/components/Container'
import OfferingCard from '@/components/blocks/OfferingCard'
import OfferingsCardSkeleton from '@/components/skeletons/OfferingsCardSkeleton'
import OfferingsFilters from '@/components/OfferingsFilters'
import { useOfferingQueryVariables } from '@hooks/useOfferingQueryVariables.ts'
import { useMDMAPI } from '@hooks/useMdmData'
import QueryString from 'qs'

const filterStateAtom = atom(false)
const filtersAtom = atom({})

export function OfferingsGridClient({ blok, locale, data }: any) {
    // Init hooks
    const { swrFetcher } = useMDMAPI()
    const { t } = useTranslation(locale || 'nl', ['common'])
    const { variables, setVariables } = useOfferingQueryVariables(blok, locale)
    const PAGE_SIZE = 24

    // State
    const [filterState, setFilterState] = useAtom(filterStateAtom)
    const [filters, setFilters] = useAtom(filtersAtom)
    const { fullWidth, maxItems } = blok
    const ContainerComponent = fullWidth ? 'div' : Container
    if (maxItems) variables.pagination.limit = maxItems

    // Fetch data
    // Implementation example: https://swr.vercel.app/examples/infinite-loading
    const {
        data: offeringsData,
        mutate,
        size,
        setSize,
        isValidating,
        isLoading,
    } = useSWRInfinite(
        (index) => {
            // Increase pagination by index
            const pagination = {
                ...variables.pagination,
                start: PAGE_SIZE * index,
            }
            return `${process.env.NEXT_PUBLIC_MDM_API_URL}/offerings?${QueryString.stringify(
                {
                    ...variables,
                    pagination,
                },
                {
                    encodeValuesOnly: true,
                }
            )}`
        },
        swrFetcher,
        {
            fallbackData: [data],
        }
    )

    const { meta } = offeringsData?.[0] || {}
    const offerings = offeringsData?.reduce((acc, val) => {
        // Actual offerings are within data key
        return [...acc, ...val.data]
    }, [])

    const isEmpty = offerings?.length === 0
    const isReachingEnd = isEmpty || (meta?.pagination?.total || 0) === offerings?.length

    // Handle pagination and filters
    const fetchMore = () => {}

    function applyFilters(filters: any) {
        // Reset pagination before filtering
        let tmpFilters: any[] = []
        setFilters(filters)
        let emptyFilter = true
        Object.keys(filters).map((key) => {
            if (filters[key] && filters[key].length > 0) {
                emptyFilter = false
            }
            tmpFilters = [...tmpFilters, ...filters[key]]
        })

        if (emptyFilter) {
            setVariables({
                ...variables,
                filters: {
                    ...variables.filters,
                    offeringAttributes: undefined,
                },
            })
            return
        }

        setVariables({
            ...variables,
            filters: {
                ...variables.filters,
                offeringAttributes: {
                    value: {
                        $contains: tmpFilters,
                    },
                },
            },
        })
        setFilterState(true)
        setSize(1)
    }

    function removeFilters() {
        setFilters({})
        setVariables({
            ...variables,
            pagination: {
                ...variables.pagination,
                start: 0,
            },
            filters: {},
        })
    }

    function handleFetchMore() {
        setSize(size + 1)
    }

    return (
        <Section>
            <h2 className="sr-only">{t('vendors')}</h2>
            <ContainerComponent className="relative">
                <div className={cn('flex items-center justify-between mb-6')}>
                    {isLoading && !offerings ? (
                        <div className="h-5 w-32 bg-gray-300 animate-pulse" />
                    ) : (
                        <div className="font-semibold text-sm text-gray-500">
                            {t('display_total_count_results', {
                                nrOfferingsLoaded: offerings?.length || 0,
                                total: meta?.pagination?.total || 0,
                            })}
                        </div>
                    )}
                    <OfferingsFilters values={filters} onChange={applyFilters} />
                </div>
                {Array.isArray(offerings) && (
                    <InfiniteScroll
                        hasChildren={true}
                        dataLength={offerings?.length}
                        hasMore={!isReachingEnd}
                        loader={
                            <ContainerComponent
                                className={cn(
                                    'grid gap-5 md:gap-8 mt-5 md:mt-8',
                                    fullWidth
                                        ? 'md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'
                                        : 'md:grid-cols-2 lg:grid-cols-3'
                                )}
                            >
                                {Array.from(Array(24).keys()).map((a, i) => (
                                    <OfferingsCardSkeleton key={i} />
                                ))}
                            </ContainerComponent>
                        }
                        next={handleFetchMore}
                    >
                        <ContainerComponent
                            className={cn(
                                'grid gap-5 md:gap-8',
                                fullWidth
                                    ? 'md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'
                                    : 'md:grid-cols-2 lg:grid-cols-3'
                            )}
                        >
                            {offerings.map((offering: any) => (
                                <OfferingCard key={offering.id} offering={offering} />
                            ))}
                            {offerings.length === 0 && (
                                <div
                                    className={cn(
                                        'border border-dark-blue-100 px-6 py-10 text-center',
                                        fullWidth
                                            ? 'md:col-span-2 lg:col-span-3 2xl:col-span-4'
                                            : 'md:col-span-2 lg:col-span-3'
                                    )}
                                >
                                    <FiSearch size={96} className="mx-auto mb-6 text-gray-300" />
                                    <div className="mb-3">{t('no_vendors_found')}</div>
                                    <button
                                        className="px-4 pt-1 pb-1.5 bg-dark-blue-100 rounded font-title font-semibold"
                                        onClick={() => removeFilters()}
                                    >
                                        {t('filter_remove')}
                                    </button>
                                </div>
                            )}
                        </ContainerComponent>
                    </InfiniteScroll>
                )}
                {!isLoading && offerings?.length < meta?.pagination?.total && (
                    <div className="flex justify-center mt-10" key="load-more-btn">
                        <Button
                            blok={{ type: 'secondary' }}
                            loading={isLoading}
                            onClick={() => handleFetchMore()}
                            disabled={isLoading}
                        >
                            Meer laden
                        </Button>
                    </div>
                )}
            </ContainerComponent>
        </Section>
    )
}

'use client'
import cn from 'classnames'
import { useEffect, useMemo } from 'react'
import { Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { atom, useAtom } from 'jotai'
import { useTranslation } from '@i18n/client'
import { Accordion, Chip } from '@mantine/core'
import { FiChevronDown, FiFilter, FiLoader } from 'react-icons/fi'

import Button from '@/components/atoms/Button'
import { attributeTypeProps } from '@/@types/mdm'
import { useLocale } from '@hooks/useLocale'
import { useMDMAPI } from '@hooks/useMdmData'

interface filterValuesProps {
    [key: string]: any
}

const filterValuesAtom = atom<filterValuesProps>({})
const filtersCountAtom = atom((get) => {
    let count = 0
    const filterValues = get(filterValuesAtom)
    Object.keys(filterValues).map((key) => {
        if (filterValues[key] && filterValues[key].length) {
            count += filterValues[key].length
        }
    })
    return count
})

export default function OfferingFilters({ values = {}, className, onChange = () => {} }: any) {
    const { locale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'nl' } = useLocale() as { locale: string }
    const { t } = useTranslation(locale, ['common'])
    const [filterValues, setFilterValues] = useAtom(filterValuesAtom)
    const [filtersCount] = useAtom(filtersCountAtom)
    const [opened, { close, open }] = useDisclosure(false)

    useEffect(() => {
        setFilterValues(values)
    }, [values, setFilterValues])

    const { useData } = useMDMAPI()
    const {
        data: attributeTypes,
        error,
        isLoading,
        mutate,
    } = useData<any>(
        {
            path: '/attribute-types',
            queryParams: {
                populate: {
                    attributeDefinitions: {
                        sort: ['name'],
                    },
                },
                pagination: {
                    limit: 100,
                    start: 0,
                },
                sort: ['name'],
            },
        },
        {
            isPaused: () => !opened,
            revalidateOnFocus: false,
        }
    )

    const { meta } = attributeTypes || {}

    useEffect(() => {
        mutate()
    }, [mutate, opened])

    function setFilter(v: string[], key: string) {
        setFilterValues({
            ...filterValues,
            [key]: [...v],
        })
    }

    function removeFilter(v: string[], key: string) {
        setFilterValues({
            ...filterValues,
            [key]: [...filterValues[key].filter((i: string) => v.includes(i))],
        })
    }

    function applyFilters() {
        onChange(filterValues)
        close()
    }

    function removeFilters() {
        const tmp = {}
        // @ts-ignore
        Object.keys(filterValues).map((key: string) => (tmp[key] = []))
        setFilterValues(tmp)
        onChange(tmp)
    }

    return (
        <>
            <div className={cn(className)}>
                <button
                    onClick={open}
                    className={cn(
                        'relative flex items-center gap-2 py-2 px-4 rounded border border-dark-blue-200 font-medium hover:bg-dark-blue-50 transition-colors',
                        isLoading && 'opacity-50'
                    )}
                >
                    {filtersCount && filtersCount > 0 ? (
                        <span className="absolute -top-3 -left-3 flex items-center justify-center w-6 h-6 rounded-full bg-carmin-red text-white font-bold text-xs">
                            {filtersCount}
                        </span>
                    ) : (
                        ''
                    )}
                    {isLoading ? <FiLoader className="animate-spin" /> : <FiFilter />}
                    {t('filters')}
                </button>
            </div>
            <Modal
                opened={opened}
                onClose={close}
                title={t('filters')}
                size="lg"
                centered
                classNames={{
                    body: 'flex grow',
                    title: 'heading-4',
                }}
            >
                <div className="flex flex-col justify-between grow h-full p-1">
                    {isLoading ? (
                        <div className="space-y-3">
                            {Array.from(Array(6).keys()).map((a, i) => (
                                <div key={i} className="h-20 sm:h-24 bg-gray-200 rounded animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <Accordion
                            variant="separated"
                            chevron={<FiChevronDown className="w-6 h-6" />}
                            classNames={{
                                chevron: 'mr-4',
                            }}
                            className="space-y-3"
                        >
                            {attributeTypes?.data?.map((attributeType: attributeTypeProps) => (
                                <Accordion.Item
                                    value={attributeType.attributes.key}
                                    key={attributeType.id + meta?.pagination?.total}
                                    className="border border-dark-blue-100 rounded"
                                >
                                    <Accordion.Control className="py-2 md:py-2 bg-white focus:outline-none rounded focus:ring focus:ring-dark-blue-100">
                                        <div>
                                            <h3 className="md:text-lg font-semibold">
                                                {attributeType.attributes.name}
                                            </h3>
                                            <Chip.Group
                                                value={filterValues[attributeType.attributes.key]}
                                                onChange={(v) => removeFilter(v, attributeType.attributes.key)}
                                                multiple
                                                // @ts-ignore
                                                position="left"
                                                spacing="xs"
                                            >
                                                <div
                                                    className={cn(
                                                        'flex flex-wrap gap-2 pt-2',
                                                        filterValues[attributeType.attributes.key]?.length > 0
                                                            ? 'mt-4 '
                                                            : 'hidden'
                                                    )}
                                                >
                                                    {attributeType.attributes.attributeDefinitions?.data.map(
                                                        (attributeDefinition) => {
                                                            if (
                                                                filterValues[attributeType.attributes.key]?.includes(
                                                                    attributeDefinition.attributes.key
                                                                )
                                                            ) {
                                                                return (
                                                                    <Chip
                                                                        key={attributeDefinition.id}
                                                                        value={attributeDefinition.attributes.key}
                                                                        classNames={{
                                                                            label: 'flex items-center justify-center font-medium text-sm text-default',
                                                                            input: 'hidden',
                                                                        }}
                                                                        size="md"
                                                                    >
                                                                        {attributeDefinition.attributes.name}
                                                                    </Chip>
                                                                )
                                                            }
                                                        }
                                                    )}
                                                </div>
                                            </Chip.Group>
                                        </div>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <Chip.Group
                                            value={filterValues[attributeType.attributes.key]}
                                            onChange={(v) => setFilter(v, attributeType.attributes.key)}
                                            multiple
                                            // @ts-ignore
                                            position="left"
                                            spacing="xs"
                                        >
                                            <div className="flex flex-wrap gap-2 pt-4 pb-2">
                                                {attributeType.attributes.attributeDefinitions.data.map(
                                                    (attributeDefinition) => {
                                                        if (
                                                            !filterValues[attributeType.attributes.key]?.includes(
                                                                attributeDefinition.attributes.key
                                                            )
                                                        ) {
                                                            return (
                                                                <Chip
                                                                    key={attributeDefinition.id}
                                                                    value={attributeDefinition.attributes.key}
                                                                    classNames={{
                                                                        label: 'flex items-center justify-center font-sans font-medium text-sm text-default',
                                                                        input: 'hidden',
                                                                    }}
                                                                    size="md"
                                                                >
                                                                    {attributeDefinition.attributes.name}
                                                                </Chip>
                                                            )
                                                        }
                                                    }
                                                )}
                                            </div>
                                        </Chip.Group>
                                    </Accordion.Panel>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    )}
                    <div className="sticky bottom-0 pb-4 -mb-4 flex gap-6 flex-col-reverse sm:flex-row shrink-0 justify-between pt-4 mt-6 md:pt-6 border-t border-dark-blue-100 bg-white">
                        <button onClick={removeFilters} className="underline font-semibold">
                            {t('remove_all')}
                        </button>
                        <div className="flex gap-2 flex-col-reverse sm:flex-row grow sm:grow-0">
                            <Button
                                onClick={close}
                                blok={{
                                    type: 'secondary',
                                    dense: true,
                                }}
                            >
                                {t('cancel')}
                            </Button>
                            <Button
                                blok={{
                                    type: 'primary',
                                    dense: true,
                                }}
                                onClick={() => applyFilters()}
                            >
                                {filtersCount ? t('show_results') : t('done')}
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

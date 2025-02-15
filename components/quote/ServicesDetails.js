import cn from 'classnames'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { useTranslation } from 'next-i18next'
import { atom, useAtom } from 'jotai'
import { Accordion, Chip, Skeleton } from '@mantine/core'
import { FiCheck, FiChevronDown } from 'react-icons/fi'

import CategoryGroupsQuery from '@/apollo/queries/category/categoryGroupsWithCategories.gql'

import CheckboxGroup from '@/components/form/CheckboxGroup'
import TextArea from '@/components/form/TextArea'

// Currently we allow only one service per quote.
const servicesAtom = atom([
    {
        categories: [],
        shortList: [],
        preferences: [],
        comment: '',
    },
])

const attributesAtom = atom([])

export default function ServicesDetails({ preSelected, className, offerings = [], onChange = () => {}, submit, done }) {
    const { locale } = useRouter()
    const { t, i18n } = useTranslation(['common', 'quote'])
    const [services, setServices] = useAtom(servicesAtom)
    const [attributes, setAttributes] = useAtom(attributesAtom)

    useEffect(() => {
        if (preSelected && Array.isArray(preSelected)) {
            setServices(preSelected)
        }
        // Pre-select the categories if we already had an offering
        if (offerings && offerings.length > 0) {
            offerings.map((offering) => {
                if (offering.attributes.categories.data && offering.attributes.categories.data.length > 0) {
                    offering.attributes.categories.data.map((category) => {
                        const selectedCategories = [...services[0].categories]
                        if (!selectedCategories.includes(category.id)) {
                            selectedCategories.push(category.id)
                            setServices((services) => {
                                const newServices = [...services]
                                newServices[0].categories = selectedCategories
                                return newServices
                            })
                        }
                    })
                }
            })
            // Assign the offering IDs on the short list
            setServices((services) => {
                const newServices = [...services]
                return newServices.map((service) => {
                    return {
                        ...service,
                        shortList: offerings.map((offering) => offering.id),
                    }
                })
            })
        }
    }, [])

    const {
        data: { categoryGroups } = {},
        loading,
        error,
    } = useQuery(CategoryGroupsQuery, {
        variables: {
            locale,
            pagination: { limit: 1000 },
            sort: ['name'],
        },
    })

    useEffect(() => {
        if (categoryGroups && categoryGroups.data.length > 0) {
            const map = []
            categoryGroups.data.map((group) => {
                group.attributes.categories.data.map((category) => {
                    category.attributes.allowedAttributes.data.map((attribute) => {
                        if (!map.find((item) => item.id === attribute.id) && attribute.attributes.allowAsPreference) {
                            map.push(attribute)
                        }
                    })
                })
            })
            setAttributes(map)
        }
    }, [categoryGroups, setAttributes])

    function setCategory(category) {
        setServices((services) => {
            const newServices = [...services]
            newServices[0].categories = category
            return newServices
        })
    }

    function setPreferences(attributeDefinition) {
        setServices((services) => {
            const newServices = [...services]
            newServices[0].preferences = attributeDefinition
            return newServices
        })
    }

    async function send() {
        done(services)
    }

    return (
        <>
            <div className={cn(className)}>
                {offerings && offerings.length > 0 ? (
                    <div>
                        <p className="mb-2 md:text-base font-semibold text-default">
                            {t('selected_vendor', { ns: 'quote' })}
                        </p>
                        <div className="font-title font-bold leading-8 text-4xl">{offerings[0].attributes.name}</div>
                    </div>
                ) : (
                    <>
                        <p className="mb-6 font-title font-bold leading-6 text-2xl">
                            {t('services_question_title', { ns: 'quote' })}
                        </p>
                        <Accordion
                            variant="separated"
                            chevron={<FiChevronDown className="w-6 h-6" />}
                            classNames={{
                                control: 'font-title text-xl font-bold',
                                chevron: 'mr-4',
                            }}
                        >
                            {loading && (
                                <div className="space-y-4">
                                    {[...Array(3).keys()].map((index) => (
                                        <Skeleton height={60} width="100%" key={index} />
                                    ))}
                                </div>
                            )}
                            {categoryGroups &&
                                categoryGroups.data &&
                                categoryGroups.data.map(
                                    (categoryGroup) =>
                                        categoryGroup.attributes.categories &&
                                        categoryGroup.attributes.categories.data &&
                                        categoryGroup.attributes.categories.data.length > 0 && (
                                            <Accordion.Item value={categoryGroup.attributes.key} key={categoryGroup.id}>
                                                <Accordion.Control>
                                                    <div className="flex items-start gap-4">
                                                        <h3 className="heading-4">{categoryGroup.attributes.name}</h3>
                                                        {
                                                            <Chip.Group
                                                                value={services[0].categories}
                                                                onChange={setPreferences}
                                                                multiple
                                                                position="left"
                                                                spacing="xs"
                                                            >
                                                                {categoryGroup.attributes.categories.data.map(
                                                                    (category) => {
                                                                        if (
                                                                            services[0].categories.includes(category.id)
                                                                        ) {
                                                                            return (
                                                                                <Chip
                                                                                    key={category.id}
                                                                                    value={category.id}
                                                                                    classNames={{
                                                                                        label: 'flex items-center justify-center font-sans font-semibold',
                                                                                        input: 'hidden',
                                                                                    }}
                                                                                >
                                                                                    {category.attributes.name}
                                                                                </Chip>
                                                                            )
                                                                        }
                                                                    }
                                                                )}
                                                            </Chip.Group>
                                                        }
                                                    </div>
                                                </Accordion.Control>
                                                <Accordion.Panel>
                                                    {
                                                        <Chip.Group
                                                            value={services[0].categories}
                                                            onChange={setCategory}
                                                            multiple
                                                            position="left"
                                                            spacing="xs"
                                                        >
                                                            {categoryGroup.attributes.categories.data.map(
                                                                (category) => {
                                                                    if (!services[0].categories.includes(category.id)) {
                                                                        return (
                                                                            <Chip
                                                                                key={category.id}
                                                                                value={category.id}
                                                                                classNames={{
                                                                                    label: 'flex items-center justify-center font-sans font-semibold',
                                                                                    input: 'hidden',
                                                                                }}
                                                                            >
                                                                                {category.attributes.name}
                                                                            </Chip>
                                                                        )
                                                                    }
                                                                }
                                                            )}
                                                        </Chip.Group>
                                                    }
                                                    {/* {
                                                (categoryGroup.attributes.categories && categoryGroup.attributes.categories.data) && <CheckboxGroup
                                                    options={categoryGroup.attributes.categories.data}
                                                    labelledBy="attributes.name"
                                                    trackedBy="id"
                                                    value={services[0].categories}
                                                    onChange={setCategory}
                                                />
                                            } */}
                                                </Accordion.Panel>
                                            </Accordion.Item>
                                        )
                                )}
                        </Accordion>
                    </>
                )}
                <hr className="my-6 md:my-12" />
                {attributes && (
                    <>
                        <p className="mb-6 font-title font-bold leading-6 text-2xl">
                            {t('preferences_question_title', { ns: 'quote' })}
                        </p>

                        <Accordion
                            variant="separated"
                            chevron={<FiChevronDown className="w-6 h-6" />}
                            classNames={{
                                control: 'font-title text-xl font-bold',
                                chevron: 'mr-4',
                            }}
                        >
                            {loading && (
                                <div className="space-y-4">
                                    {[...Array(4).keys()].map((index) => (
                                        <Skeleton height={60} width="100%" key={index} />
                                    ))}
                                </div>
                            )}
                            {attributes.map(
                                (attribute) =>
                                    attribute.attributes.attributeDefinitions &&
                                    attribute.attributes.attributeDefinitions.data &&
                                    attribute.attributes.attributeDefinitions.data.length > 0 && (
                                        <Accordion.Item value={attribute.attributes.key} key={attribute.id}>
                                            <Accordion.Control>
                                                <div className="flex items-start gap-4">
                                                    <h3 className="heading-4">{attribute.attributes.name}</h3>
                                                    {
                                                        <Chip.Group
                                                            value={services[0].preferences}
                                                            onChange={setPreferences}
                                                            multiple
                                                            position="left"
                                                            spacing="xs"
                                                        >
                                                            {attribute.attributes.attributeDefinitions.data.map(
                                                                (attributeDefinition) => {
                                                                    if (
                                                                        services[0].preferences.includes(
                                                                            attributeDefinition.id
                                                                        )
                                                                    ) {
                                                                        return (
                                                                            <Chip
                                                                                key={attributeDefinition.id}
                                                                                value={attributeDefinition.id}
                                                                                classNames={{
                                                                                    label: 'flex items-center justify-center font-sans font-semibold',
                                                                                    input: 'hidden',
                                                                                }}
                                                                            >
                                                                                {attributeDefinition.attributes.name}
                                                                            </Chip>
                                                                        )
                                                                    }
                                                                }
                                                            )}
                                                        </Chip.Group>
                                                    }
                                                </div>
                                            </Accordion.Control>
                                            <Accordion.Panel>
                                                {
                                                    <Chip.Group
                                                        value={services[0].preferences}
                                                        onChange={setPreferences}
                                                        multiple
                                                        position="left"
                                                        spacing="xs"
                                                    >
                                                        {attribute.attributes.attributeDefinitions.data.map(
                                                            (attributeDefinition) => {
                                                                if (
                                                                    !services[0].preferences.includes(
                                                                        attributeDefinition.id
                                                                    )
                                                                ) {
                                                                    return (
                                                                        <Chip
                                                                            key={attributeDefinition.id}
                                                                            value={attributeDefinition.id}
                                                                            classNames={{
                                                                                label: 'flex items-center justify-center font-sans font-semibold',
                                                                                input: 'hidden',
                                                                            }}
                                                                        >
                                                                            {attributeDefinition.attributes.name}
                                                                        </Chip>
                                                                    )
                                                                }
                                                            }
                                                        )}
                                                    </Chip.Group>
                                                }
                                            </Accordion.Panel>
                                        </Accordion.Item>
                                    )
                            )}
                        </Accordion>
                    </>
                )}
                <hr className="my-6 md:my-12" />
                <p className="mb-6 font-title font-bold leading-6 text-2xl">
                    {t('service_comment_title', { ns: 'quote' })}
                </p>
                <TextArea
                    placeholder={t('type_your_message')}
                    name="comment"
                    minRows={4}
                    autosize
                    value={services[0].comment}
                    onChange={(e) =>
                        setServices((services) => {
                            const newServices = [...services]
                            newServices[0].comment = e.target.value
                            return newServices
                        })
                    }
                />
                {submit && <div className="spacer pb-6 md:pb-12" />}
                {submit && submit(send)}
            </div>
        </>
    )
}

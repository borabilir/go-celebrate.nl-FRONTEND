import { useEffect } from 'react'
import { useListState } from '@mantine/hooks'
import { useTranslation } from 'next-i18next'
import {
    Accordion,
    Badge
} from '@mantine/core';

import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import CategoryGroupsQuery from '@/apollo/queries/category/categoryGroupsWithCategories.gql'

import {
    FiChevronRight,
    FiChevronLeft,
    FiCheck
} from 'react-icons/fi'

import Button from '@/components/atoms/Button'

export default function OccasionsQuestion({
    categories,
    setCategories,
    onNext,
    onPrev
}) {
    const { t } = useTranslation('common', 'quote')
    const { locale } = useRouter()
    
    const { data: { categoryGroups } = {}, loading, error } = useQuery(CategoryGroupsQuery, {
        variables: { locale }
    })
    
    const [values, handlers] = useListState([])

    useEffect(() => {
        handlers.setState(categories)
    }, [categories])

    function handleCategoryChange(e) {
        const { value, checked } = e.target
        const categoryItem = categoryGroups.reduce((acc, group) => {
            const found = group.categories?.find(category => category.key === value)
            if (found) acc = found
            return acc
        }, null)
        const categoryChecked = values.find(category => category.key === value)
        if (categoryChecked && !checked) {
            // Remove the value from the list
            setCategories([...categories.filter(category => category.key !== value)])
        } else if (!categoryChecked && categoryItem) {
            // Add the value to the list
            setCategories([...categories, categoryItem])
        }
    }

    function selectedInCategoryGroup(groupKey) {
        return categoryGroups?.reduce((acc, group) => {
            if (group.key === groupKey) {
                group.categories?.map(category => {
                    const found = values.find(c => c.key === category.key)
                    if (found) acc++
                })
            }
            return acc
        }, null)
    }

    return (
        <>
            <div className="p-4 md:p-5 lg:p-8 xl:p-10">
                <p className="heading-3 mb-6">{ t('category_step_what_are_you_looking_for', { ns: 'quote' }) }</p>
                <Accordion>
                    {
                        categoryGroups && categoryGroups.map(group => <Accordion.Item
                            key={group.id}
                            label={<div className="flex items-center">
                                { group.name }
                                { selectedInCategoryGroup(group.key) && <Badge
                                    className="ml-2 text-default bg-light-blue bg-opacity-20 text-opacity-70"
                                >
                                    {selectedInCategoryGroup(group.key)}
                                </Badge> }
                            </div>}
                        >
                                <ul
                                    className="grid lg:grid-cols-2 gap-3 md:gap-4"
                                >
                                    {
                                        group.categories && group.categories.map(category => <label
                                            key={category.id}
                                            htmlFor={category.key}
                                            className="relative"
                                        >
                                            <input
                                                hidden
                                                id={category.key}
                                                value={category.key}
                                                type="checkbox"
                                                onChange={handleCategoryChange}
                                                className="peer"
                                                checked={!!values.find(c => c.key === category.key)}
                                            />
                                            <span
                                                className="flex items-center gap-3 pr-4 md:pr-6 py-2 md:py-3 pl-4 md:pl-6 border-dark-blue-200 rounded border shadow-sm cursor-pointer outline-none  peer-checked:pl-12 peer-checked:border-transparent peer-checked:bg-default peer-checked:text-white"
                                            >
                                                { category.name }
                                            </span>
                                            <FiCheck className="hidden peer-checked:block absolute top-4 mt-0.5 left-3.5 text-success md:w-5 md:h-5" />
                                        </label>)
                                    }
                                </ul>
                        </Accordion.Item> )
                    }
                </Accordion>
            </div>
            <div className="sticky bottom-0 bg-dark-blue-100 mt-10">
                <div className="flex items-center justify-between px-4 py-2 md:py-3">
                    <button className="flex items-center" blok={{ type: 'secondary', dense: true }} onClick={onPrev}>
                        <FiChevronLeft className="w-5 h-5 mt-1 sm:mr-2" />
                        {/* <span className="hidden sm:inline-block">Prev</span> */}
                    </button>
                    <Button
                        onClick={onNext}
                        blok={{ type: 'primary', dense: true }}
                        disabled={(!values || values.length === 0)}
                    >
                        { t('next') }
                        <FiChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </div>
        </>
    )
}
import { useEffect } from 'react'
import { useListState } from '@mantine/hooks'
import { useTranslation } from 'next-i18next'

import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import CuisinesQuery from '@/apollo/queries/cuisine/cuisines.gql'

import {
    FiChevronRight,
    FiChevronLeft,
    FiCheck
} from 'react-icons/fi'

import Button from '@/components/atoms/Button'

export default function OccasionsQuestion({
    cuisines,
    setCuisines,
    onNext,
    onPrev
}) {
    const { t } = useTranslation('common', 'quote')
    const { locale } = useRouter()
    
    const { data: { cuisines: cuisinesData } = {}, loading, error } = useQuery(CuisinesQuery, {
        variables: { locale }
    })
    
    const [values, handlers] = useListState([])

    useEffect(() => {
        handlers.setState(cuisines)
    }, [cuisines])

    function handleCuisineChange(e) {
        const { value, checked } = e.target
        const cuisineChecked = values.find(cuisine => cuisine.key === value)
        const cuisineItem = cuisinesData.find(cuisine => cuisine.key === value)
        if (cuisineChecked && !checked) {
            // Remove the value from the list
            setCuisines([...cuisines.filter(cuisine => cuisine.key !== value)])
        } else if (!cuisineChecked && cuisineItem) {
            // Add the value to the list
            setCuisines([...cuisines, cuisineItem])
        }
    }

    return (
        <>
            <div className="p-4 md:p-5 lg:p-8 xl:p-10">
                <p className="heading-3 mb-6">{ t('cuisine_step_preference_title', { ns: 'quote' }) }</p>
                <ul
                    className="grid lg:grid-cols-2 gap-3 md:gap-4"
                >
                    {
                        cuisinesData?.map(cuisine => <label
                            key={cuisine.id}
                            htmlFor={cuisine.key}
                            className="relative"
                        >
                            <input
                                hidden
                                id={cuisine.key}
                                value={cuisine.key}
                                type="checkbox"
                                onChange={handleCuisineChange}
                                className="peer"
                                checked={!!values.find(c => c.key === cuisine.key)}
                            />
                            <span
                                className="flex items-center gap-3 pr-4 md:pr-6 py-2 md:py-3 pl-4 md:pl-6 border-dark-blue-200 rounded border shadow-sm cursor-pointer outline-none  peer-checked:pl-12 peer-checked:border-transparent peer-checked:bg-default peer-checked:text-white"
                            >
                                { cuisine.name }
                            </span>
                            <FiCheck className="hidden peer-checked:block absolute top-4 mt-0.5 left-3.5 text-success md:w-5 md:h-5" />
                        </label>)
                    }
                </ul>
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
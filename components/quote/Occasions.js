import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import OccasionsQuery from '@/apollo/queries/occasion/occasionsList.gql'
import { useTranslation } from 'next-i18next'
import {
    FiChevronRight,
} from 'react-icons/fi'

import ClientOnly from '@/components/helpers/ClientOnly'
import SelectBoxList from '@/components/form/SelectBoxList'
import Button from '@/components/atoms/Button'

export default function OccasionsQuestion({
    occasion,
    setOccasion,
    onNext
}) {
    const { t } = useTranslation('common', 'quote')
    const { locale } = useRouter()
    const { data: { occasions } = {}, loading, error } = useQuery(OccasionsQuery, {
        variables: { locale }
    })
    return (
        <>
            <div className="p-4 md:p-5 lg:p-8 xl:p-10">
                <p className="heading-3 mb-6">{ t('what_is_the_occasion', { ns: 'quote' }) }</p>
                <ClientOnly>
                    <SelectBoxList
                        options={occasions}
                        labelledBy="name"
                        name="occasion"
                        onChange={setOccasion}
                        value={occasion}
                    />
                </ClientOnly>
            </div>
            <div className="sticky bottom-0 bg-dark-blue-100 mt-10">
                <div className="flex items-center justify-between px-4 py-2 md:py-3">
                    <span></span>
                    <Button
                        onClick={onNext}
                        blok={{ type: 'primary', dense: true }}
                        disabled={!occasion}
                    >
                        { t('next') }
                        <FiChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </div>
        </>
    )
}
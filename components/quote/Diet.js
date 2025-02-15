import { Textarea } from '@mantine/core'
import { useTranslation } from 'next-i18next'

import {
    FiChevronRight,
    FiChevronLeft,
} from 'react-icons/fi'
import Button from '@/components/atoms/Button'

export default function Diet({
    diet,
    setDiet,
    onNext,
    onPrev
}) {
    const { t } = useTranslation('common', 'quote')
    return (
        <>
            <div className="p-4 md:p-5 lg:p-8 xl:p-10">
                    <p className="heading-3 mb-2">{ t('diet_step_title', { ns: 'quote' }) }</p>
                    <div className="text-sm opacity-50 mb-6">{ t('optional') }</div>
                    <Textarea
                        placeholder={t('type_your_message')}
                        value={diet}
                        onChange={setDiet}
                    />
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
                    >
                        { t('next') }
                        <FiChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </div>
        </>
    )
}
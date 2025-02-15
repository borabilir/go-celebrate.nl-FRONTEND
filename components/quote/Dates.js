import { DatePicker } from '@mantine/dates'
import { useTranslation } from 'next-i18next'

import { FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi'

import Button from '@/components/atoms/Button'

const dateInputStyles = {
    input: {
        fontFamily:
            'RebrandTxt, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    },
}

export default function Dates({ startDate, endDate, setStartDate, setEndDate, onNext, onPrev }) {
    const { t } = useTranslation('common', 'quote')
    const tomorrow = new Date()

    if (startDate) {
        tomorrow.setDate(startDate.getDate() + 1)
    }

    return (
        <>
            <div className="p-4 md:p-5 lg:p-8 xl:p-10">
                <p className="heading-3 mb-6">{t('dates_title_when_is_the_event', { ns: 'quote' })}</p>
                <div className="space-y-4 sm:space-y-0 sm:flex sm:gap-6">
                    <DatePicker
                        label={t('start_date', { ns: 'quote' })}
                        placeholder={t('choose_date', { ns: 'quote' })}
                        value={startDate}
                        onChange={setStartDate}
                        clearable={false}
                        styles={dateInputStyles}
                        minDate={new Date()}
                        className="font-sans text-base w-full"
                        classNames={{
                            label: 'md:text-base font-semibold',
                            input: 'md:text-lg md:p-6 border-dark-blue-200',
                        }}
                        icon={<FiCalendar />}
                    />
                    <DatePicker
                        label={t('end_date', { ns: 'quote' })}
                        placeholder={t('one_day_event', { ns: 'quote' })}
                        value={endDate}
                        onChange={setEndDate}
                        styles={dateInputStyles}
                        minDate={tomorrow}
                        className="font-sans text-base w-full"
                        classNames={{
                            label: 'md:text-base font-semibold',
                            input: 'md:text-lg md:p-6 border-dark-blue-200',
                        }}
                        icon={<FiCalendar />}
                    />
                </div>
                {!endDate ||
                    (startDate > endDate && (
                        <p className="text-carmin-red mt-4 font-semibold">
                            {t('end_date_must_be_after_start_date', { ns: 'quote' })}
                        </p>
                    ))}
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
                        disabled={endDate && startDate > endDate}
                    >
                        {t('next')}
                        <FiChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </div>
        </>
    )
}

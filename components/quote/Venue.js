import { useState } from 'react'
import VenueAutocomplete from '@/components/quote/VenueAutocomplete'
import { useTranslation } from 'next-i18next'

import {
    FiChevronRight,
    FiChevronLeft,
    FiCheck,
    FiEdit
} from 'react-icons/fi'

import Button from '@/components/atoms/Button'

export default function Venue({
    venue,
    setVenue,
    onPrev,
    onNext
}) {
    const { t } = useTranslation('common', 'quote')
    const [venueSearch, setVenueSearch] = useState('')
    function resetVenue() {
        setVenue('')
        setVenueSearch('')
    }
    return (
        <>
            <div className="p-4 md:p-5 lg:p-8 xl:p-10">
                <p className="heading-3 mb-6">{ t('venue_title_where_is_the_event', { ns: 'quote' }) }</p>
                {
                    !venue && <VenueAutocomplete
                        onChange={setVenue}
                        searchValue={venueSearch}
                        onSearchChange={setVenueSearch}
                        placeholder={t('venue_placeholder_search', { ns: 'quote' })}
                    />
                }
                {
                    venue && <div className="flex items-center justify-between px-4 py-3 border border-dark-blue-200 rounded">
                        <div className="flex items-center">
                            <FiCheck className="w-5 h-5 text-green mr-2" />
                            {venue}
                        </div>
                        <button
                            className="shrink-0"
                            onClick={e => resetVenue()}
                        >
                            <FiEdit className="w-5 h-5" />
                        </button>
                    </div>
                }
            </div>
            <div className="sticky bottom-0 bg-dark-blue-100 mt-10">
                <div className="flex items-center justify-between px-4 py-2 md:py-3">
                    <button className="flex items-center" blok={{ type: 'secondary', dense: true }} onClick={onPrev}>
                        <FiChevronLeft className="w-5 h-5 mt-1 sm:mr-2" />
                        {/* <span className="hidden sm:inline-block">Prev</span> */}
                    </button>
                    <Button
                        onClick={() => venue && onNext()}
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
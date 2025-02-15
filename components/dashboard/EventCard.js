import { useEffect } from 'react'
import { BiCalendarEvent, BiChevronRight } from 'react-icons/bi'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(localizedFormat)

function loadLocale(locale) {
    locales[locale]().then(() => dayjs.locale(locale))
}

// Make sure we have all available locales ready to be imported
const locales = {}
process.env.NEXT_PUBLIC_ACTIVE_LANGUAGES?.split(',').map((locale) => {
    locales[locale] = () => import(`dayjs/locale/${locale}.js`)
})

export default function EventCard({ event }) {
    const { locale } = useRouter()
    const { t } = useTranslation(['common'])
    useEffect(() => {
        loadLocale(locale)
    }, [locale])
    return (
        <li
            key={event.id}
            className="relative flex justify-between px-4 md:pl-8 py-4 md:py-6 bg-white rounded-md border border-gray-200 focus-within:ring focus-within:ring-dark-blue focus-within:ring-opacity-10 focus-within:bg-gray-50 hover:bg-gray-50"
        >
            <div>
                <Link
                    href={{ pathname: 'app/events/[id]', query: { id: event.id } }}
                    className="inline-block mb-1.5 focus:outline-none focus:bg-dark-blue focus:bg-opacity-10 focus:ring focus:ring-dark-blue focus:ring-opacity-10"
                >
                    <h3 className="font-medium md:text-lg text-link">
                        {event.attributes.occasion?.data?.attributes?.name}
                    </h3>
                    <span className="absolute inset-0" />
                </Link>
                {event.attributes.startDate && (
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                        <BiCalendarEvent />
                        {t('on', 'common')} {dayjs(event.attributes.startDate).format('LL', locale.toUpperCase())}
                    </div>
                )}
            </div>
            <BiChevronRight className="w-6 h-6 text-gray-400" />
        </li>
    )
}

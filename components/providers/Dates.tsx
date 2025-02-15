'use client'

/**
 * There's no way to dynamically load the locales, so we need to import them all.
 * See https://github.com/mantinedev/mantine/discussions/4206
 */

import 'dayjs/locale/nl'
import 'dayjs/locale/en'
// TODO import any other locales you need

import { useParams } from 'next/navigation'
import { DatesProvider as MantineDatesProvider } from '@mantine/dates'

export function DatesProvider({ children }: { children: React.ReactNode }) {
    const { locale = 'nl' } = useParams() as { locale: string }
    const twoLetterIsoLocale = locale?.split('-')[0]
    return (
        <MantineDatesProvider settings={{ locale: twoLetterIsoLocale, firstDayOfWeek: 1 }}>
            {children}
        </MantineDatesProvider>
    )
}

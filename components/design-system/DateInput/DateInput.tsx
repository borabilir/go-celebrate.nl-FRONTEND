'use client'
import { useParams } from 'next/navigation'
import { DateInput as MantineDateInput, type DateInputProps } from '@mantine/dates'
import dayjs from 'dayjs'
import 'dayjs/locale/nl'

export function DateInput(props: DateInputProps) {
    const { locale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'nl' } = useParams() as { locale: string }
    return <MantineDateInput locale={locale?.toUpperCase()} {...props} />
}

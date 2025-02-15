import cn from 'classnames'
import { useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { atom, useAtom } from 'jotai'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { DatePicker } from '@mantine/dates'
import { Chip } from '@mantine/core'
import 'dayjs/locale/nl'

import { useDebouncedValue } from '@mantine/hooks'

import { FiChevronRight, FiChevronLeft, FiCalendar } from 'react-icons/fi'
import { BiEuro } from 'react-icons/bi'

import VenueAutocomplete from '@/components/quote/VenueAutocomplete'
import SelectBoxList from '@/components/form/SelectBoxList'
import TextField from '@/components/form/TextField'
import TextArea from '@/components/form/TextArea'
import { stringify } from 'postcss'

const detailsAtom = atom({})
const locationAtom = atom('')
const venueSearchAtom = atom('')

const schema = yup
    .object()
    .shape({
        numberOfGuests: yup.string().required('field_required'),
        budgetPerPerson: yup.string().when('paidBy', {
            is: 'host',
            then: yup.string().required('field_required'),
        }),
        paidBy: yup.string().required('field_required'),
        eventDetails: yup.string().required('field_required'),
        startDate: yup.date().required('field_required'),
        endDate: yup.date(),
    })
    .required()

const dateInputStyles = {
    input: {
        fontFamily:
            'RebrandTxt, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    },
}

export default function EventDetails({ details = {}, onChange = () => {}, submit, done, className }) {
    const { asPath, locale } = useRouter()
    const { t } = useTranslation('common', 'quote')
    const tomorrow = new Date()

    const [localDetails, setLocalDetails] = useAtom(detailsAtom)
    const [location, setLocation] = useAtom(locationAtom)
    const [venueSearch, setVenueSearch] = useAtom(venueSearchAtom)
    let { numberOfGuests, budgetPerPerson, paidBy, eventDetails, startDate, endDate, occasions, occasion } = details

    const occasionValue = occasion ? `${occasion.id}` : null

    const defaultValues = {
        paidBy: '',
    }

    if (startDate) {
        startDate = new Date(startDate)
        tomorrow.setDate(startDate.getDate() + 1)
    } else {
        startDate = tomorrow
    }

    if (startDate && localDetails.startDate !== new Date(startDate)) {
        defaultValues.startDate = new Date(startDate)
    }
    if (endDate && localDetails.endDate !== new Date(endDate)) {
        defaultValues.endDate = new Date(endDate)
    }

    const {
        control,
        formState: { errors, isValid },
        handleSubmit,
        setValue,
    } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(schema),
        defaultValues,
    })

    const eventData = useWatch({ control })
    const [debouncedEventData] = useDebouncedValue(eventData, 500)

    useEffect(
        () =>
            onChange({
                ...debouncedEventData,
                occasion,
                location,
            }),
        [debouncedEventData, occasion, location]
    )

    async function send() {
        handleSubmit(
            async (data) => {
                try {
                    done({
                        ...data,
                        location: location || venueSearch, // Fall back to the user input if no option was selected in the autocomplete
                        occasion,
                    })
                } catch (error) {
                    console.error(error)
                    throw "Couldn't save user info"
                }
            },
            (error) => {
                /* Silent */
            }
        )()
    }

    return (
        <>
            <div className={cn(className)}>
                <p className="heading-3 mb-6">{t('about_your_event', { ns: 'quote' })}</p>
                {/* <div className="text-sm opacity-50 mb-6">{ t('optional') }</div> */}
                {
                    // If no occasion selected
                    occasion ? (
                        <div className="mb-10">
                            <p className="font-bold font-title mb-4">Gelegenheid</p>
                            <div className="flex items-center gap-4">
                                <Chip
                                    classNames={{
                                        label: 'inline-flex items-center justify-center font-sans font-semibold text-base text-default',
                                        input: 'hidden',
                                    }}
                                    size="lg"
                                    checked
                                >
                                    {occasion.attributes.name}
                                </Chip>
                                <button
                                    className="underline font-bold"
                                    onClick={() =>
                                        onChange({
                                            ...eventData,
                                            occasion: null,
                                        })
                                    }
                                >
                                    Wijzigen
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="mb-10">
                            <p className="font-bold font-title mb-4">Wat is het gelegenheid?</p>
                            <Chip.Group
                                value={occasionValue}
                                onChange={(v) =>
                                    onChange({
                                        ...eventData,
                                        occasion: occasions?.data?.find((o) => o.id === v),
                                    })
                                }
                                position="left"
                                spacing="xs"
                            >
                                {occasions?.data?.map((occasion) => {
                                    return (
                                        <Chip
                                            key={occasion.id}
                                            value={occasion.id}
                                            classNames={{
                                                label: 'flex items-center justify-center font-sans font-semibold text-base text-default',
                                                input: 'hidden',
                                            }}
                                            size="lg"
                                        >
                                            {occasion.attributes.name}
                                        </Chip>
                                    )
                                })}
                            </Chip.Group>
                        </div>
                    )
                }

                <p className="font-bold font-title mb-4">In welke plaats is het evenement?</p>
                <VenueAutocomplete
                    onChange={setLocation}
                    searchValue={venueSearch}
                    onSearchChange={setVenueSearch}
                    placeholder={t('venue_placeholder_search', { ns: 'quote' })}
                    className="mb-10"
                />

                <div className="mb-6 md:mb-8">
                    <p className="font-bold font-title mb-4">{t('dates_title_when_is_the_event', { ns: 'quote' })}</p>
                    <div className="space-y-4 sm:space-y-0 sm:flex sm:gap-6">
                        <Controller
                            name="startDate"
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    {...field}
                                    locale={locale}
                                    name="startDate"
                                    label={t('start_date', { ns: 'quote' })}
                                    placeholder={t('choose_date', { ns: 'quote' })}
                                    clearable={false}
                                    styles={dateInputStyles}
                                    minDate={new Date()}
                                    className="font-sans text-base w-full"
                                    classNames={{
                                        root: 'font-sans',
                                        wrapper: 'font-sans',
                                        cell: 'font-sans',
                                        label: 'md:text-base font-semibold',
                                        input: 'text-base md:text-lg py-5 border-dark-blue-200',
                                    }}
                                    icon={<FiCalendar />}
                                    required={true}
                                    error={
                                        errors.startDate?.message
                                            ? t(errors.startDate?.message, {
                                                  ns: 'common',
                                                  fieldName: t('start_date', { ns: 'quote' }),
                                              })
                                            : undefined
                                    }
                                />
                            )}
                        />
                        <Controller
                            name="endDate"
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    {...field}
                                    locale={locale}
                                    name="endDate"
                                    label={t('end_date', { ns: 'quote' })}
                                    placeholder={t('one_day_event', { ns: 'quote' })}
                                    clearable={true}
                                    styles={dateInputStyles}
                                    minDate={startDate ? new Date(startDate) : new Date()}
                                    className="font-sans text-base w-full"
                                    classNames={{
                                        root: 'font-sans',
                                        wrapper: 'font-sans',
                                        cell: 'font-sans',
                                        label: 'md:text-base font-semibold',
                                        input: 'md:text-lg py-5 border-dark-blue-200',
                                    }}
                                    icon={<FiCalendar />}
                                />
                            )}
                        />
                    </div>
                    {startDate && endDate && startDate > endDate && (
                        <p className="text-carmin-red mt-4 font-semibold">
                            {t('end_date_must_be_after_start_date', { ns: 'quote' })}
                        </p>
                    )}
                </div>

                <Controller
                    name="paidBy"
                    control={control}
                    render={({ field }) => (
                        <SelectBoxList
                            {...field}
                            label={t('who_pays', { ns: 'quote' })}
                            options={[
                                { key: 'guests', label: t('paid_by_guests', { ns: 'quote' }) },
                                { key: 'host', label: t('paid_by_organizer', { ns: 'quote' }) },
                            ]}
                            labelledBy="label"
                            trackedBy="key"
                            name="paidBy"
                            className="mb-6 md:mb-8"
                            dense={true}
                            required={true}
                            error={
                                errors.paidBy?.message
                                    ? t(errors.paidBy?.message, { ns: 'common', fieldName: 'paidBy' })
                                    : undefined
                            }
                        />
                    )}
                />

                <Controller
                    name="numberOfGuests"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label={t('expected_nr_of_guests', { ns: 'quote' })}
                            className="max-w-xs mb-6"
                            name="numberOfGuests"
                            type="number"
                            required={true}
                            error={
                                errors.numberOfGuests?.message &&
                                t('expected_nr_of_guests_error_message', { ns: 'quote' })
                            }
                        />
                    )}
                />
                <Controller
                    name="budgetPerPerson"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label={t('budget_per_guest', { ns: 'quote' })}
                            className="max-w-xs mb-6 md:mb-8"
                            name="budgetPerPerson"
                            icon={<BiEuro />}
                            type="number"
                            disabled={eventData.paidBy === 'guests'}
                            error={
                                errors.budgetPerPerson?.message
                                    ? t(errors.budgetPerPerson?.message, { ns: 'common', fieldName: 'budgetPerPerson' })
                                    : undefined
                            }
                        />
                    )}
                />
                {eventData.budgetPerPerson &&
                    eventData.numberOfGuests &&
                    eventData.budgetPerPerson.length > 1 &&
                    eventData.budgetPerPerson * eventData.numberOfGuests < 600 && (
                        <div className="p-6 bg-red-100 mb-6 md:mb-8">
                            {t('budget_validation_message', { ns: 'quote' })}
                        </div>
                    )}

                <Controller
                    name="eventDetails"
                    control={control}
                    render={({ field }) => (
                        <TextArea
                            {...field}
                            label={t('event_details_message', { ns: 'quote' })}
                            placeholder={t('type_your_message')}
                            name="eventDetails"
                            required={true}
                            error={
                                errors.eventDetails?.message
                                    ? t(errors.eventDetails?.message, { ns: 'common', fieldName: 'eventDetails' })
                                    : undefined
                            }
                            minRows={4}
                            autosize
                        />
                    )}
                />
                {submit && <div className="spacer pb-6 md:pb-12" />}
                {submit && submit(send)}
            </div>
        </>
    )
}

import { useRef, useEffect } from 'react'
import { atom, useAtom } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import OccasionsQuery from '@/apollo/queries/occasion/occasionsList.gql'
import Image from 'next/legacy/image'

import { Progress } from '@mantine/core'
import { DatePicker } from '@mantine/dates'

import { fetchOfferings } from '@/lib/mdm.hydrate'

import Button from '@/components/atoms/Button'
import TextField from '@/components/form/TextField'
import Section from '@/components/Section'
import Container from '@/components/Container'

import Occasions from '@/components/quote/Occasions'
import PersonalDetails from '@/components/quote/PersonalDetails'
import VenueAutocomplete from '@/components/quote/VenueAutocomplete'

import { FiChevronLeft, FiChevronRight, FiCheck, FiCalendar, FiEdit } from 'react-icons/fi'

const steps = [
    'occasion',
    'date',
    'venue',
    'category-group',
    'food:type',
    'food:diet',
    'payment',
    'nr-guests',
    'budget',
    'check-budget',
    'description',
    'personal-details', // First name, last name, company, email, phone
]

const occasionsAtom = atom([])

const stepAtom = atom(steps[0])
const occasionAtom = atom()
const startDateAtom = atom()
const endDateAtom = atom()
const venueAtom = atom('')
const venueSearchAtom = atom('')

const selectedOccasionAtom = atom((get) => {
    const occasions = get(occasionsAtom)
    const occasion = get(occasionAtom)
    if (occasions && occasion) {
        return occasions.find((o) => o.key === occasion)
    }
    return null
})

const userDataValidAtom = atom(false)
const userDataAtom = atom({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
})

const dateInputStyles = {
    input: {
        fontFamily:
            'RebrandTxt, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    },
}

export default function GetQuote({
    offering,
    _r, // Get the location where we want to kick the user back in case of exiting the RFQ process
    _o, // Pre-selected occasion
    _start,
    _end,
}) {
    const preHydrate = []
    // Pre-set all the data we already know
    if (!!_o) preHydrate.push([occasionAtom, _o])
    if (!!_start) preHydrate.push([startDateAtom, new Date(_start)])
    if (!_start) {
        const nowDate = new Date()
        nowDate.setDate(nowDate.getDate() + 7)
        preHydrate.push([startDateAtom, nowDate])
    }
    if (!!_end) preHydrate.push([endDateAtom, _end])
    if (!!_o && !_start) preHydrate.push([stepAtom, steps[1]])
    if (!!_o && !!_start) preHydrate.push([stepAtom, steps[2]])
    // Set the correct step for the form so the users can see the questions they already answered
    useHydrateAtoms(preHydrate)

    const { locale } = useRouter()
    const {
        data: { occasions: occasionsData } = {},
        loading,
        error,
    } = useQuery(OccasionsQuery, {
        variables: { locale },
    })
    useEffect(() => {
        console.log(occasionsData)
        setOccasions(occasionsData)
    }, [occasionsData])

    const [step, setStep] = useAtom(stepAtom)

    /* STEP: PERSONAL DETAILS */
    const personalDetailsRef = useRef()
    const [userDataValid, setUserDataValid] = useAtom(userDataValidAtom)
    const [userData, setUserData] = useAtom(userDataAtom)

    function handlePersonalDataChange(e) {
        const { valid, data } = e
        setUserDataValid(valid)
        if (valid) {
            setUserData(data)
        }
    }
    function validatePersonalData() {
        personalDetailsRef.current()
    }

    // If we validated and set the date, let's move to the next stage
    useEffect(() => {
        if (userDataValid && userData) {
            next('personal-details')
        }
    }, [userDataValid, userData])

    /* STEP: EVENT DETAILS */
    const [occasions, setOccasions] = useAtom(occasionsAtom)
    const [occasion, setOccasion] = useAtom(occasionAtom)
    const [selectedOccasion] = useAtom(selectedOccasionAtom)

    const [startDate, setStartDate] = useAtom(startDateAtom)
    const [endDate, setEndDate] = useAtom(endDateAtom)
    const tomorrow = new Date()
    if (startDate) {
        tomorrow.setDate(startDate.getDate() + 1)
    }
    const [venue, setVenue] = useAtom(venueAtom)
    const [venueSearch, setVenueSearch] = useAtom(venueSearchAtom)

    function next(currentStep) {
        const foundStep = steps.indexOf(currentStep)
        if (foundStep >= 0) {
            setStep(steps[steps.indexOf(currentStep) + 1])
        }
    }
    function prev(currentStep) {
        const foundStep = steps.indexOf(currentStep)
        if (foundStep > 0) {
            setStep(steps[steps.indexOf(currentStep) - 1])
        }
    }

    return (
        <>
            <Progress
                value={steps.length * (steps.indexOf(step) + 1)}
                radius="none"
                classNames={{
                    root: 'bg-dark-blue-100',
                    bar: 'bg-light-blue',
                }}
            />
            <main className="py-8 md:py-16">
                <Section>
                    <Container>
                        <h1 className="heading-2 max-w-3xl">
                            Offerte aanvragen
                            {offering && ` voor ${offering.name}`}
                        </h1>
                        <div className="grid lg:grid-cols-4 mt-6 lg:mt-12">
                            {/* SLIDES */}
                            <div className="slide self-start col-span-1 lg:col-span-3 mb-12 lg:mb-0 lg:mr-10 xl:mr-16 border border-dark-blue-200 rounded">
                                {step === 'occasion' && (
                                    <>
                                        <div className="p-4 md:p-5 lg:p-8 xl:p-10">
                                            <p className="heading-3 mb-6">Wat is de gelegenheid?</p>
                                            <Occasions setOccasion={setOccasion} occasion={occasion} />
                                        </div>
                                        <div className="sticky bottom-0 bg-dark-blue-100 mt-10">
                                            <div className="flex items-center justify-between px-4 md:px-6 lg:px-10 py-2 md:py-3">
                                                <span></span>
                                                <Button
                                                    onClick={() => next('occasion')}
                                                    blok={{ type: 'primary', dense: true }}
                                                >
                                                    Next
                                                    <FiChevronRight className="w-5 h-5 ml-2" />
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {step === 'date' && (
                                    <>
                                        <div className="p-4 md:p-5 lg:p-8 xl:p-10">
                                            <p className="heading-3 mb-6">When is the event?</p>
                                            <div className="space-y-4 sm:space-y-0 sm:flex sm:gap-6">
                                                <DatePicker
                                                    label="Start date"
                                                    placeholder="Choose date"
                                                    value={startDate}
                                                    onChange={setStartDate}
                                                    clearable={false}
                                                    styles={dateInputStyles}
                                                    className="font-sans text-base w-full"
                                                    classNames={{
                                                        label: 'md:text-base font-semibold',
                                                        input: 'md:text-lg md:p-6 border-dark-blue-200',
                                                    }}
                                                    icon={<FiCalendar />}
                                                />
                                                <DatePicker
                                                    label="End date"
                                                    placeholder="One day event"
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
                                        </div>
                                        <div className="sticky bottom-0 bg-dark-blue-100 mt-10">
                                            <div className="flex items-center justify-between px-4 md:px-6 lg:px-10 py-2 md:py-3">
                                                <Button
                                                    blok={{ type: 'secondary', dense: true }}
                                                    onClick={() => prev('date')}
                                                >
                                                    <FiChevronLeft className="w-5 h-5 sm:mr-2" />
                                                    <span className="hidden sm:inline-block">Prev</span>
                                                </Button>
                                                <Button
                                                    onClick={() => next('date')}
                                                    blok={{ type: 'primary', dense: true }}
                                                >
                                                    Next
                                                    <FiChevronRight className="w-5 h-5 ml-2" />
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {step === 'venue' && (
                                    <>
                                        <div className="p-4 md:p-5 lg:p-8 xl:p-10">
                                            <p className="heading-3 mb-6">Where is the event?</p>
                                            {!venue && (
                                                <VenueAutocomplete
                                                    onChange={setVenue}
                                                    searchValue={venueSearch}
                                                    onSearchChange={setVenueSearch}
                                                />
                                            )}
                                            {venue && (
                                                <div className="flex items-center justify-between px-4 py-3 border border-dark-blue-200 rounded">
                                                    <div className="flex items-center">
                                                        <FiCheck className="w-5 h-5 text-green mr-2" />
                                                        {venue}
                                                    </div>
                                                    <button className="shrink-0" onClick={(e) => setVenue('')}>
                                                        <FiEdit className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="sticky bottom-0 bg-dark-blue-100 mt-10">
                                            <div className="flex items-center justify-between px-4 md:px-6 lg:px-10 py-2 md:py-3">
                                                <Button
                                                    blok={{ type: 'secondary', dense: true }}
                                                    onClick={() => prev('venue')}
                                                >
                                                    <FiChevronLeft className="w-5 h-5 sm:mr-2" />
                                                    <span className="hidden sm:inline-block">Prev</span>
                                                </Button>
                                                <Button
                                                    onClick={() => venue && next('venue')}
                                                    blok={{ type: 'primary', dense: true }}
                                                >
                                                    Next
                                                    <FiChevronRight className="w-5 h-5 ml-2" />
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {step === 'personal-details' && (
                                    <>
                                        <PersonalDetails
                                            submit={personalDetailsRef}
                                            onChange={handlePersonalDataChange}
                                            defaultValues={userData}
                                        />
                                        <div className="sticky bottom-0 bg-dark-blue-100 mt-6">
                                            <div className="flex items-center justify-between p-2 md:p-4">
                                                {/* <Button blok={{ type: 'secondary', dense: true }} onClick={() => prev(step)}>
                                                        <FiChevronLeft className="w-5 h-5 sm:mr-2" />
                                                        <span className="hidden sm:inline-block">Prev</span>
                                                    </Button> */}
                                                <span></span>
                                                <Button
                                                    onClick={() => validatePersonalData()}
                                                    blok={{ type: 'primary', dense: true }}
                                                >
                                                    Next
                                                    <FiChevronRight className="w-5 h-5 ml-2" />
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            {/* // SLIDES */}
                            <div className="col-span-1 sm:grid sm:grid-cols-2 sm:gap-10 lg:gap-0 lg:block space-y-4 md:space-y-6">
                                {offering && (
                                    <div className="relative block aspect-w-16 aspect-h-10 bg-dark-blue-100 rounded overflow-hidden">
                                        {offering.coverPhoto && (
                                            <Image
                                                src={offering.coverPhoto.url}
                                                alt={offering.name}
                                                className="object-cover"
                                                layout="fill"
                                            />
                                        )}
                                        <div className="absolute inset-0 flex flex-col justify-end p-3 md:p-4 z-20 md:text-lg font-semibold text-white">
                                            {offering.name}
                                        </div>
                                        <div className="absolute inset-x-0 top-1/4 bottom-0 h-3/4 z-10 bg-gradient-to-t from-default opacity-75" />
                                    </div>
                                )}
                                <div>
                                    {selectedOccasion && <div className="font-bold mb-2">{selectedOccasion.name}</div>}
                                    {startDate && (
                                        <div className="font-bold mb-2">
                                            {startDate.toLocaleDateString()}
                                            {endDate && (
                                                <>
                                                    <span className="mx-2">-</span>
                                                    {endDate.toLocaleDateString()}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="border border-dark-blue-200 rounded p-4 md:p-5">
                                    <h3 className="text-lg font-semibold mb-3">Book or get a quote in 2 min.</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start">
                                            <div className="shrink-0 mt-0.5 mr-2 bg-green p-1 rounded-full text-white">
                                                <FiCheck />
                                            </div>
                                            Only verified vendors
                                        </li>
                                        <li className="flex items-start">
                                            <div className="shrink-0 mt-0.5 mr-2 bg-green p-1 rounded-full text-white">
                                                <FiCheck />
                                            </div>
                                            Vendor guarantee
                                        </li>
                                        <li className="flex items-start">
                                            <div className="shrink-0 mt-0.5 mr-2 bg-green p-1 rounded-full text-white">
                                                <FiCheck />
                                            </div>
                                            Non-bindig quote or direct booking and payment
                                        </li>
                                        <li className="flex items-start">
                                            <div className="shrink-0 mt-0.5 mr-2 bg-green p-1 rounded-full text-white">
                                                <FiCheck />
                                            </div>
                                            Bla bla bla
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </Container>
                </Section>
            </main>
        </>
    )
}

export async function getServerSideProps({ locale, query }) {
    try {
        const { offering: offeringId } = query
        const requests = new Array(1).fill(null)
        if (offeringId) {
            requests[0] = fetchOfferings({ locale, where: { id: offeringId } })
        }
        const [offering] = await Promise.all(requests)
        return {
            props: {
                ...query,
                offering: offering && offering[0] ? offering[0] : null,
            },
        }
    } catch (err) {
        console.error(err)
    }
}

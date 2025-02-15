import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from "next/legacy/image"
import { useAtom, atom } from 'jotai'
import { atomWithMachine } from 'jotai-xstate'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import { Progress } from '@mantine/core'
import { FiCheck } from 'react-icons/fi'

import { createQuoteMachine } from '@/machines/quoteMachine'

import Section from '@/components/Section'
import Container from '@/components/Container'

import Occasions from '@/components/quote/Occasions'
import Categories from '@/components/quote/Categories'
import Dates from '@/components/quote/Dates'
import Venue from '@/components/quote/Venue'
import Cuisines from '@/components/quote/Cuisines'
import Diet from '@/components/quote/Diet'
import EventDetails from '@/components/quote/EventDetails'
import ContactDetails from '@/components/quote/ContactDetails'

const quoteMachine = atomWithMachine(createQuoteMachine)
const progressMachine = atom(0)

export default function Quote({}) {
    const { t, i18n } = useTranslation(['common', 'quote'])
    const { locale, query, isReady } = useRouter()
    const [state, send] = useAtom(quoteMachine)
    const [progress, setProgress] = useAtom(progressMachine)

    useEffect(() => {
        // Wait for router to kick in
        if (!isReady) return
        /* Initiate our state machine so data loading starts */
        send({ type: 'DONE', query, locale })
    }, [query])

    const steps = [
        'occasion',
        'category',
        'date',
        'venue',
        'cuisine',
        'diet',
        'eventDetails',
        'budgetCheck',
        'contactDetails',
        'complete',
    ]

    useEffect(() => {
        setProgress((steps.indexOf(state.value) + 1) * (100 / steps.length))
    }, [state.value])

    return (
        <>
            <Progress
                value={progress}
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
                            {t('get_a_quote_title', { ns: 'quote' })}
                            {state.context.offering && state.context.offering.length > 0 && (
                                <span className="block text-base md:text-lg mt-2 font-sans opacity-60">
                                    {state.context.offering[0]?.name}
                                </span>
                            )}
                        </h1>
                        <div className="mb-6">
                            {/* { JSON.stringify(state.context) } */}
                            <br />
                            <br />
                            {state.value}
                            <div>
                                <button onClick={(e) => send({ type: 'PREV' })}>prev</button>
                                <button onClick={(e) => send({ type: 'NEXT' })}>next</button>
                            </div>
                        </div>
                        <div className="grid lg:grid-cols-4 mt-6 lg:mt-12">
                            {/* SLIDES */}
                            <div className="slide self-start col-span-1 lg:col-span-3 mb-12 lg:mb-0 lg:mr-10 xl:mr-16 border border-dark-blue-200 rounded">
                                {/* onDoubleClick={e => send({ type: state.matches('reading') ? 'dblclick' : 'commit', value: 'foo' })} */}

                                {(state.matches('idle') || state.matches('init')) && (
                                    <>
                                        <div
                                            onClick={(e) => send({ type: 'DONE', query, locale })}
                                            className="p-4 md:p-6 space-y-6 mb-12"
                                        >
                                            <div className="h-8 bg-dark-blue-100 animate-pulse"></div>
                                            <div className="w-1/2 h-8 bg-dark-blue-100 animate-pulse"></div>
                                            <div className="w-2/3 h-8 bg-dark-blue-100 animate-pulse"></div>
                                        </div>
                                        <div className="h-10 bg-dark-blue-100 animate-pulse"></div>
                                    </>
                                )}

                                {state.matches('occasion') && (
                                    <Occasions
                                        occasion={state.context.occasion}
                                        setOccasion={(occasion) => send({ type: 'SELECT', occasion })}
                                        onNext={(e) => send({ type: 'NEXT' })}
                                    />
                                )}
                                {state.matches('category') && (
                                    <Categories
                                        categories={state.context.categories}
                                        setCategories={(categories) => send({ type: 'SELECT', categories })}
                                        onNext={(e) => send({ type: 'NEXT' })}
                                        onPrev={(e) => send({ type: 'PREV' })}
                                    />
                                )}

                                {state.matches('date') && (
                                    <Dates
                                        startDate={state.context.dateFrom}
                                        endDate={state.context.dateTo}
                                        setStartDate={(startDate) => send({ type: 'SET_START_DATE', startDate })}
                                        setEndDate={(endDate) => send({ type: 'SET_END_DATE', endDate })}
                                        onNext={(e) => send({ type: 'NEXT' })}
                                        onPrev={(e) => send({ type: 'PREV' })}
                                    />
                                )}

                                {state.matches('venue') && (
                                    <Venue
                                        venue={state.context.venue}
                                        setVenue={(venue) => send({ type: 'SET_VENUE', venue })}
                                        onNext={(e) => send({ type: 'NEXT' })}
                                        onPrev={(e) => send({ type: 'PREV' })}
                                    />
                                )}

                                {state.matches('cuisine') && (
                                    <Cuisines
                                        cuisines={state.context.cuisines}
                                        setCuisines={(cuisines) => send({ type: 'SELECT', cuisines })}
                                        onNext={(e) => send({ type: 'NEXT' })}
                                        onPrev={(e) => send({ type: 'PREV' })}
                                    />
                                )}

                                {state.matches('diet') && (
                                    <Diet
                                        diet={state.context.diet}
                                        setDiet={(diet) => send({ type: 'SELECT', diet })}
                                        onNext={(e) => send({ type: 'NEXT' })}
                                        onPrev={(e) => send({ type: 'PREV' })}
                                    />
                                )}

                                {state.matches('eventDetails') && (
                                    <EventDetails
                                        details={{
                                            numberOfGuests: state.context.numberOfGuests,
                                            budgetPerPerson: state.context.budgetPerPerson,
                                            paidBy: state.context.paidBy,
                                            eventDetails: state.context.eventDetails,
                                        }}
                                        onNext={(e) => send({ type: 'NEXT' })}
                                        onPrev={(e) => send({ type: 'PREV' })}
                                    />
                                )}
                                {state.matches('contactDetails') && (
                                    <ContactDetails
                                        onNext={(e) => send({ type: 'NEXT' })}
                                        onPrev={(e) => send({ type: 'PREV' })}
                                    />
                                )}
                            </div>
                            {/* /// SLIDES */}
                            <div className="col-span-1 sm:grid sm:grid-cols-2 sm:gap-10 lg:gap-0 lg:block space-y-4 md:space-y-6">
                                {state.context.offering &&
                                    state.context.offering.map((offering) => (
                                        <div
                                            key={offering.id}
                                            className="relative block aspect-w-16 aspect-h-10 bg-dark-blue-100 rounded overflow-hidden"
                                        >
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
                                    ))}
                                <div>
                                    {state.context.occasion && (
                                        <div className="font-bold mb-2">{state.context.occasion.name}</div>
                                    )}
                                    {state.context.dateFrom && (
                                        <div className="font-bold mb-2">
                                            {state.context.dateFrom.toLocaleDateString()}
                                            {state.context.dateTo && (
                                                <>
                                                    <span className="mx-2">-</span>
                                                    {state.context.dateTo.toLocaleDateString()}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="border border-dark-blue-200 rounded p-4 md:p-5">
                                    <h3 className="text-lg font-semibold mb-3">
                                        {t('book_or_get_in_2_minutes', { ns: 'quote' })}
                                    </h3>
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

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'quote'])),
        },
    }
}

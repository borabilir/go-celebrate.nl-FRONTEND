import cn from 'classnames'
import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useAtom, atom } from 'jotai'
import { atomWithMachine } from 'jotai-xstate'
import { Stepper, Skeleton, LoadingOverlay, ActionIcon } from '@mantine/core'
import { useSession } from 'next-auth/react'

import { FiChevronRight, FiCheck, FiMessageCircle } from 'react-icons/fi'
import { FaFacebook, FaInstagram } from 'react-icons/fa'

import { TbConfetti } from 'react-icons/tb'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import PersonalDetails from '@/components/quote/PersonalDetails'
import EventDetails from '@/components/quote/EventDetails'
import ServicesDetails from '@/components/quote/ServicesDetails'

import StickyElement from '@/components/StickyElement'

import Button from '@/components/atoms/Button'
import Section from '@/components/Section'
import Container from '@/components/Container'
import EventPreview from '@/components/quote/EventPreview'

import { createBookingMachine } from '@/machines/bookingMachine'

const bookingMachine = atomWithMachine(createBookingMachine)
const activeAtom = atom((get) => {
    const state = get(bookingMachine)
    if (state.matches('idle')) return 0
    if (state.matches('init')) return 0
    if (state.matches('personalDetails')) return 0
    if (state.matches('eventDetails')) return 1
    if (state.matches('services')) return 2
    if (state.matches('submitting')) return 2
    if (state.matches('error')) return 2
    if (state.matches('success')) return 2
    return null
})

export default function Quote({}) {
    const { t, i18n } = useTranslation(['common', 'quote'])
    const { locale, query, isReady } = useRouter()
    const [state, send] = useAtom(bookingMachine)
    const [active] = useAtom(activeAtom)
    const { data: userData, status } = useSession()

    useEffect(() => {
        if (status !== 'authenticated' || !userData?.user) return
        send({ type: 'SET_USER', user: userData.user })
    }, [send, userData, status])

    const initMachine = useCallback(() => {
        send({ type: 'DONE', query, locale })
    }, [send, query, locale])

    useEffect(() => {
        // Wait for router to kick in
        if (!isReady) return
        /* Initiate our state machine so data loading starts */
        initMachine()
    }, [initMachine, isReady])

    const handleEventDetailsChange = useCallback(
        (details) => {
            send({ type: 'UPDATE', ...details })
        },
        [send]
    )

    return (
        <>
            <Head>
                <title>{t('get_a_quote_title', { ns: 'quote' })} | Go Celebrate</title>
            </Head>
            {/* JSON.stringify(state.value) */}
            <Section>
                {process.env.NODE_ENV === 'development' && (
                    <div className="flex items-center justify-between bg-red-200 p-4">
                        <span>Developer tools</span>
                        <Button
                            blok={{
                                dense: true,
                                variant: 'primaryAlt',
                            }}
                            onClick={() => send('RESET', { query, locale })}
                        >
                            Restart machine
                        </Button>
                        <Button
                            blok={{
                                dense: true,
                                variant: 'primaryAlt',
                            }}
                            onClick={() => send({ type: 'DONE', user: {} })}
                        >
                            Next
                        </Button>
                    </div>
                )}
                <Container className="py-6 md:py-12">
                    <h1 className="heading-3 mb-6 md:mb-12">
                        {state.context.offerings && state.context.offerings.length > 0
                            ? t('get_a_quote_title_with_offering', {
                                  ns: 'quote',
                                  offeringName: state.context.offerings[0].attributes.name,
                              })
                            : t('get_a_quote_title', { ns: 'quote' })}
                    </h1>
                    {state.matches('success') && (
                        <div className="border border-dark-blue-100 px-6 py-10 text-center">
                            <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-dark-blue rounded-full">
                                <TbConfetti size={48} className="text-teal-300" />
                            </div>
                            <div className="heading-3 mb-2">We&apos;ve received your request!</div>
                            <div className="mb-6">
                                You&apos;re booking number is #
                                <span className="font-bold underline">
                                    {state.context?.rfq?.attributes?.quoteNumber}
                                </span>
                                . Wel&apos;ll get back to you soon with a suitable offer.
                            </div>
                            <hr className="w-32 mx-auto my-6" />
                            <p className="text-gray-500 max-w-lg mx-auto mb-4">
                                Vermaak je in de tussentijd met onze blogartikelen of volg ons op Facebook, Instagram om
                                op de hoogte te blijven van al het smakelijke nieuws over foodtrucks, chefs en catering.
                            </p>
                            <div className="flex justify-center gap-4">
                                <ActionIcon
                                    className="shrink-0"
                                    size="xl"
                                    radius="xl"
                                    variant="filled"
                                    component="a"
                                    href="/blog"
                                >
                                    <FiMessageCircle size={24} />
                                </ActionIcon>
                                <ActionIcon
                                    className="shrink-0"
                                    size="xl"
                                    radius="xl"
                                    variant="filled"
                                    component="a"
                                    href="https://www.facebook.com/gocelebrateinternational"
                                    target="_blank"
                                >
                                    <FaFacebook size={24} />
                                </ActionIcon>
                                <ActionIcon
                                    className="shrink-0"
                                    size="xl"
                                    radius="xl"
                                    variant="filled"
                                    component="a"
                                    href="https://www.instagram.com/gocelebrateinternational/"
                                    target="_blank"
                                >
                                    <FaInstagram size={24} />
                                </ActionIcon>
                            </div>
                        </div>
                    )}

                    {!state.matches('success') && (
                        <Stepper
                            active={active}
                            breakpoint="sm"
                            classNames={{
                                root: 'relative font-sans',
                                content: 'font-sans',
                            }}
                        >
                            <Stepper.Step
                                label={t('step_1_title', { ns: 'quote' })}
                                completedIcon={<FiCheck className="w-6 h-6" />}
                            >
                                <>
                                    <LoadingOverlay
                                        visible={state.matches('idle') || state.matches('init')}
                                        overlayBlur={6}
                                    />
                                    <div className="grid grid-cols-12 gap-6 md:gap-8 lg:gap-12 xl:gap-24 justify-center py-6 md:py-12">
                                        <PersonalDetails
                                            defaultValues={state.context.user}
                                            className="col-span-12 md:col-span-8"
                                            done={(user) => send({ type: 'DONE', user })}
                                            submit={(send, loading) => (
                                                <StickyElement className="-mx-6 sm:-mx-10" position="bottom">
                                                    {(sticking) => (
                                                        <div
                                                            className={cn(
                                                                'flex items-center justify-between px-4 py-2',
                                                                sticking ? 'bg-dark-blue-100' : 'md:py-0'
                                                            )}
                                                        >
                                                            <span></span>
                                                            <Button
                                                                onClick={send}
                                                                loading={loading}
                                                                className="gap-2"
                                                                blok={{
                                                                    variant: 'primaryAlt',
                                                                    dense: true,
                                                                }}
                                                            >
                                                                {t('next', {
                                                                    ns: 'common',
                                                                })}
                                                                <FiChevronRight className="translate-y-0.5" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                </StickyElement>
                                            )}
                                        />
                                        <EventPreview
                                            offerings={state.context.offerings}
                                            occasion={state.context.occasion}
                                            startDate={state.context.startDate}
                                            endDate={state.context.endDate}
                                            className="col-span-12 md:col-span-8 lg:col-span-4"
                                        />
                                    </div>
                                </>
                            </Stepper.Step>
                            <Stepper.Step
                                label={t('step_2_title', { ns: 'quote' })}
                                completedIcon={<FiCheck className="w-6 h-6" />}
                            >
                                <div className="grid grid-cols-12 gap-6 md:gap-8 lg:gap-12 xl:gap-24 justify-center py-6 md:py-12">
                                    <EventDetails
                                        className="col-span-12 md:col-span-8"
                                        details={state.context}
                                        done={(eventDetails) => send({ type: 'DONE', eventDetails })}
                                        onChange={(details) => handleEventDetailsChange(details)}
                                        submit={(send, loading) => (
                                            <StickyElement className="-mx-6 sm:-mx-10" position="bottom">
                                                {(sticking) => (
                                                    <div
                                                        className={cn(
                                                            'flex items-center justify-between px-4 py-2',
                                                            sticking ? 'bg-dark-blue-100' : 'md:py-0'
                                                        )}
                                                    >
                                                        <span></span>
                                                        <Button
                                                            onClick={send}
                                                            loading={loading}
                                                            className="gap-2"
                                                            blok={{
                                                                variant: 'primaryAlt',
                                                                dense: true,
                                                            }}
                                                        >
                                                            {t('next', {
                                                                ns: 'common',
                                                            })}
                                                            <FiChevronRight className="translate-y-0.5" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </StickyElement>
                                        )}
                                    />
                                    <EventPreview
                                        offerings={state.context.offerings}
                                        occasion={state.context.occasion}
                                        startDate={state.context.startDate}
                                        endDate={state.context.endDate}
                                        className="col-span-12 md:col-span-8 lg:col-span-4"
                                    />
                                </div>
                            </Stepper.Step>
                            <Stepper.Step
                                label={t('step_3_title', { ns: 'quote' })}
                                completedIcon={<FiCheck className="w-6 h-6" />}
                            >
                                <div className="grid grid-cols-12 gap-6 md:gap-8 lg:gap-12 xl:gap-24 justify-center py-6 md:py-12">
                                    <ServicesDetails
                                        className="col-span-12 md:col-span-8"
                                        offerings={state.context.offerings}
                                        preSelected={state.context.eventServices}
                                        done={(eventServices) => {
                                            if (state.matches('error')) {
                                                send({ type: 'RETRY' })
                                            } else if (state.matches('success')) {
                                                send({ type: 'RETRY' })
                                            } else {
                                                send({
                                                    type: 'DONE',
                                                    eventServices,
                                                })
                                            }
                                        }}
                                        submit={(send, loading) => (
                                            <StickyElement className="-mx-6 sm:-mx-10" position="bottom">
                                                {(sticking) => (
                                                    <div
                                                        className={cn(
                                                            'flex items-center justify-between px-4 py-2',
                                                            sticking ? 'bg-dark-blue-100' : 'md:py-0'
                                                        )}
                                                    >
                                                        <span></span>
                                                        <Button
                                                            onClick={send}
                                                            loading={loading}
                                                            className="gap-2"
                                                            blok={{
                                                                variant: 'primaryAlt',
                                                                dense: true,
                                                            }}
                                                        >
                                                            {t('send')}
                                                        </Button>
                                                    </div>
                                                )}
                                            </StickyElement>
                                        )}
                                    />
                                    <EventPreview
                                        offerings={state.context.offerings}
                                        occasion={state.context.occasion}
                                        startDate={state.context.startDate}
                                        endDate={state.context.endDate}
                                        className="col-span-12 md:col-span-8 lg:col-span-4"
                                    />
                                </div>
                            </Stepper.Step>
                        </Stepper>
                    )}
                    {state.matches('eventDetails') && <div> Event details </div>}
                </Container>
            </Section>
            {/* <p className="mb-2 break-all">{JSON.stringify(state.context)}</p> */}
            {/*
            {state && <h2 className="heading-2">{state.value}</h2> }
            <hr />
            <p>
                <button onClick={() => initMachine()}>Init</button>
            </p>
            <p>
                <button onClick={() => send({ type: 'DONE' })}>Done</button>
            </p>
            <p>
                <button onClick={() => send({ type: 'SUBMITTED' })}>Submitted</button>
            </p>
            <p>
                <button onClick={() => send('DONE', { to: 'registerMachine' })}>Personal details fillInfo</button>
            </p>
            <p>
                <button onClick={() => send({ type: 'eventDetails' })}>Event details</button>
            </p> */}
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

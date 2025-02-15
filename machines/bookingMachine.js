import { assign, createMachine } from 'xstate'
import MdmClient from '@/apollo/clients/mdm'

import OfferingsQuery from '@/apollo/queries/offering/offerings.gql'
import AttributeDefinitionsQuery from '@/apollo/queries/attribute/attributeDefinitions.gql'
import OccasionsQuery from '@/apollo/queries/occasion/occasionsList.gql'
import CreateRfqMutation from '@/apollo/mutations/booking/createRfq.gql'

import registerMachine from './registerMachine'
import eventMachine from './eventMachine'

export const createBookingMachine = createMachine({
    id: 'bookingMachine',
    initial: 'idle',
    context: {
        user: null,
        offerings: [],
        occasions: [],
        occasion: null,
        location: '',
        startDate: null,
        endDate: null,
        categories: [],
        numberOfGuests: null,
        budgetPerPerson: null,
        paidBy: null,
        eventDetails: null,
        endDate: null,
        eventServices: [],
        submitError: null,
        query: {},
        locale: 'nl',
        rfq: null,
    },
    on: {
        RESET: {
            target: '.init',
            actions: assign({
                query: (_, { query }) => query,
                locale: (_, { locale }) => locale,
                startDate: () => new Date(),
            }),
        },
        SET_USER: {
            actions: assign({
                user: (_, { user }) => user,
            }),
        },
    },
    states: {
        idle: {
            /* While we wait for react to hydrate */
            on: {
                DONE: {
                    target: 'init',
                    actions: assign({
                        query: (_, { query }) => query,
                        locale: (_, { locale }) => locale,
                        startDate: () => new Date(),
                    }),
                },
            },
        },
        init: {
            on: {
                DONE: {
                    target: 'personalDetails',
                    actions: assign({
                        occasions: (_, { data: { occasions } }) => occasions,
                        occasion: (_, { data: { occasion } }) => occasion,
                        offerings: (_, { data: { offerings } }) => offerings,
                        eventServices: (_, { data: { attributeDefinitions } }) => {
                            if (attributeDefinitions && attributeDefinitions.length > 0) {
                                return [
                                    {
                                        categories: [],
                                        shortList: [],
                                        bids: [],
                                        preferences: attributeDefinitions.map((a) => a.id),
                                        comment: '',
                                    },
                                ]
                            }
                        },
                        startDate: (_, { data: { startDate } }) => (startDate ? new Date(startDate) : null),
                        endDate: (_, { data: { endDate } }) => (endDate ? new Date(endDate) : null),
                        categories: (_, { data: { offering } }) => {
                            if (offering && Array.isArray(offering)) {
                                return offering.reduce((acc, offering) => {
                                    if (offering.categories) acc = [...acc, ...offering.categories]
                                    return acc
                                }, [])
                            }
                            return []
                        },
                    }),
                },
            },
            invoke: {
                src: (context, event) => async (callback) => {
                    try {
                        const { query = {} } = context
                        let {
                            offering, // Id of a selected offering
                            _start, // Start date
                            _end, // End date
                            _o: _occasion,
                            _category,
                            _attributeDefinitions,
                        } = query
                        const booking = localStorage.getItem('booking')
                        // It's better to fetch the occasions and find the one we need because it's cached anyway
                        const {
                            data: { occasions: occasionsData },
                        } = await MdmClient.query({
                            query: OccasionsQuery,
                            variables: {
                                pagination: {
                                    pageSize: 1000,
                                },
                                locale: context.locale,
                            },
                        })
                        if (_occasion) {
                            _occasion = occasionsData?.data?.find((o) => o.attributes.key === _occasion)
                        }
                        if (offering) {
                            const {
                                data: { offerings: offeringsData },
                            } = await MdmClient.query({
                                query: OfferingsQuery,
                                variables: {
                                    publicationState: 'PREVIEW',
                                    locale: 'all',
                                    filters: {
                                        id: {
                                            in: [offering],
                                        },
                                    },
                                },
                            })
                            offering = offeringsData ? offeringsData.data : undefined
                        }
                        if (booking) {
                            // We want to get back to a booking state. We can retrieve the user and event and restore our state.
                        }
                        if (_attributeDefinitions) {
                            // If we were redirected from a link where we already specified what we want in terms of services
                            const {
                                data: { attributeDefinitions: attributeDefinitionsData },
                            } = await MdmClient.query({
                                query: AttributeDefinitionsQuery,
                                variables: {
                                    locale: context.locale,
                                    filters: {
                                        id: {
                                            in: _attributeDefinitions.split(','),
                                        },
                                    },
                                },
                            })
                            _attributeDefinitions = attributeDefinitionsData ? attributeDefinitionsData.data : undefined
                        }
                        console.log(_attributeDefinitions)
                        console.log('Start', _start, new Date(_start))
                        callback({
                            type: 'DONE',
                            data: {
                                occasion: _occasion,
                                occasions: occasionsData,
                                offerings: offering,
                                startDate: _start ? new Date(_start) : null,
                                endDate: _end ? new Date(_end) : null,
                                attributeDefinitions: _attributeDefinitions,
                            },
                        })
                    } catch (error) {
                        // window undefined error will occur on server
                        console.log(error)
                    }
                },
            },
        },
        personalDetails: {
            on: {
                DONE: {
                    target: 'eventDetails',
                    actions: assign({
                        user: (context, { user }) => {
                            return {
                                firstName: user.firstName,
                                lastName: user.lastName,
                                username: user.email, // So strapi can save the user
                                email: user.email,
                                companyName: user.company,
                                phone: user.phone,
                                termsAcceptedAt: new Date().toISOString(),
                            }
                        },
                    }),
                },
            },
        },
        eventDetails: {
            on: {
                UPDATE: {
                    target: 'eventDetails',
                    actions: assign({
                        startDate: (_, { startDate }) => startDate,
                        endDate: (_, { endDate }) => endDate,
                        occasion: (_, { occasion }) => {
                            if (occasion) return occasion
                        },
                    }),
                },
                DONE: {
                    target: 'services',
                    actions: assign({
                        startDate: (context, { eventDetails = {} }) => eventDetails.startDate,
                        endDate: (context, { eventDetails = {} }) => eventDetails.endDate,
                        numberOfGuests: (context, { eventDetails = {} }) => parseInt(eventDetails.numberOfGuests),
                        budgetPerPerson: (context, { eventDetails = {} }) =>
                            eventDetails.budgetPerPerson ? parseInt(eventDetails.budgetPerPerson) : null,
                        paidBy: (context, { eventDetails = {} }) => eventDetails.paidBy,
                        eventDetails: (context, { eventDetails = {} }) => eventDetails.eventDetails,
                        location: (context, { eventDetails = {} }) => eventDetails.location,
                        occasion: (context, { eventDetails = {} }) => eventDetails.occasion,
                    }),
                },
            },
        },
        services: {
            on: {
                DONE: {
                    target: 'submitting',
                    actions: assign({
                        eventServices: (_, { eventServices = [] }) => eventServices,
                    }),
                },
            },
        },
        submitting: {
            on: {
                SUCCESS: {
                    target: 'success',
                    actions: assign({
                        rfq: (_, { rfq }) => rfq,
                    }),
                },
                ERROR: {
                    target: 'error',
                    actions: assign({
                        submitError: (_, { error = '' }) => error,
                    }),
                },
            },
            invoke: {
                src: (context, event) => async (callback) => {
                    console.log(context)
                    try {
                        const {
                            data: { createRfq },
                        } = await MdmClient.mutate({
                            mutation: CreateRfqMutation,
                            variables: {
                                message: '',
                                user: context.user,
                                event: {
                                    startDate: context.startDate,
                                    endDate: context.endDate,
                                    numberOfGuests: context.numberOfGuests,
                                    budgetPerPerson: context.budgetPerPerson,
                                    paidBy: context.paidBy,
                                    description: context.eventDetails,
                                    preferredLocale: context.locale,
                                    location: context.location,
                                    occasion: context.occasion ? context.occasion.id : null,
                                },
                                eventServices: context.eventServices,
                                locale: context.locale,
                            },
                        })
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth',
                        })
                        callback({ type: 'SUCCESS', rfq: createRfq })
                    } catch (error) {
                        console.error(error)
                        callback({ type: 'ERROR', error })
                    }
                },
            },
        },
        error: {
            on: {
                RETRY: {
                    target: 'submitting',
                    actions: assign({
                        submitError: (_, { error = '' }) => error,
                    }),
                },
            },
        },
        success: {
            on: {
                RETRY: {
                    target: 'submitting',
                },
                END: {
                    target: 'end',
                },
            },
        },
        end: {
            type: 'final',
        },
    },
})

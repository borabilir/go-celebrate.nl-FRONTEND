import { assign, createMachine } from 'xstate'
import MdmClient from '@/apollo/clients/mdm'
import OccasionsQuery from '@/apollo/queries/occasion/occasionsList.gql'
import OfferingQuery from '@/apollo/queries/offering/offering.gql'

import eventServiceMachine from './eventServiceMachine'

export const createEventMachine = createMachine({
    id: 'eventMachine',
    initial: 'idle',
    context: {
        /* We store our URL qery here */
        query: {},
        locale: null,
        /* Pre-fetched data from MDM */
        categoriesList: [],
        occasionsList: [],
        offering: [], // Can have multiple one LATER
        /* Event details - User filled data */
        occasion: null,
        startDate: null,
        endDate: null,
        location: '',
        paidBy: null, // Guests or host
        numberOfGuests: null,
        budgetPerPerson: null,
        /* Optional, only if the per guest budget is not high enough */
        flexibleBudget: false,
        description: '',
        services: []
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
                        startDate: () => new Date()
                    })
                }
            }
        },
        init: {
            on: {
                /* Based on the initial state, we redirect the user to the appropriate slide */
                OCCASION: {
                    target: 'occasion',
                },
                CATEGORY: {
                    target: 'category',
                    actions: assign({
                        occasion: (_, { data: { occasion } }) => occasion,
                    })
                },
                DATE: {
                    target: 'date',
                    actions: assign({
                        occasion: (_, { data: { occasion } }) => occasion,
                        offering: (_, { data: { offering } }) => offering,
                        categories: (_, { data: { offering } }) => {
                            if (offering && Array.isArray(offering)) {
                                return offering.reduce((acc, offering) => {
                                    if (offering.categories) acc = [...acc, ...offering.categories]
                                    return acc
                                }, [])
                            }
                            return []
                        },
                    })
                }
            },
            invoke: {
                src: (context, event) => async callback => {
                    try {
                        const {
                            query = {},
                            locale = 'all'
                        } = context
                        let {
                            offering, // Id of a selected offering
                            _startDate, // Start date
                            _endDate, // End date
                            _occasion,
                            _category
                        } = query
                        if (_occasion) {
                            // It's better to fetch the occasions and find the one we need because it's cached anyway
                            const { data: { occasions: occasionsData } } = await MdmClient.query({
                                query: OccasionsQuery,
                                variables: {
                                    pagination: {
                                        limit: -1
                                    },
                                    locale
                                }
                            })
                            _occasion = occasionsData.find(o => o.key === _occasion)
                        }
                        if (offering) {
                            const { data: { offering: offeringData } } = await MdmClient.query({
                                query: OfferingQuery,
                                variables: {
                                    id: offering,
                                    locale
                                }
                            })
                            offering = offeringData ? [offeringData] : undefined
                        }

                        if (_occasion && !(_category || offering)) {
                            callback({ type: 'CATEGORY', data: { occasion: _occasion } })
                        } else if (offering && Array.isArray(offering)) {
                            callback({ type: 'DATE', data: { offering }})
                        } else {
                            callback('OCCASION')
                        }
                    } catch (error) {
                        // window undefined error will occur on server
                    }
                }
            }
        },
        occasion: {
            on: {
                SELECT: {
                    target: 'category',
                    actions: assign({
                        occasion: (_, { occasion }) => occasion
                    })
                },
                NEXT: {
                    target: 'category'
                }
            }
        },
        date_and_venue: {
            on: {
                SET_START_DATE: {
                    actions: assign({
                        dateFrom: (_, { startDate }) => startDate
                    })
                },
                SET_END_DATE: {
                    actions: assign({
                        dateTo: (_, { endDate }) => endDate
                    })
                },
                SET_VENUE: {
                    actions: assign({
                        venue: (_, { venue }) => venue
                    })
                },
                SET_PAID_BY: {
                    actions: assign({
                        paidBy: (_, { paidBy }) => paidBy
                    })
                },
                SET_NUMBER_OF_GUESTS: {
                    actions: assign({
                        numberOfGuests: (_, { numberOfGuests }) => numberOfGuests
                    })
                },
                SET_BUDGET_PER_PERSON: {
                    actions: assign({
                        budgetPerPerson: (_, { budgetPerPerson }) => budgetPerPerson
                    })
                },
                SET_DESCRIPTION: {
                    actions: assign({
                        description: (_, { description }) => description
                    })
                },
                SET_FLEXIBLE_BUDGET: {
                    actions: assign({
                        flexibleBudget: (_, { flexibleBudget }) => flexibleBudget
                    })
                },
                PREV: {
                    target: 'occasion',
                },
                NEXT: [
                    {
                        // Leave out the cuisine if we have an offering selected
                        target: 'category',
                        cond: (context) => !context.offering || context.offering.length === 0
                    },
                    {
                        target: 'diet'
                    }
                ]
            }
        },
        category: {
            on: {
                SELECT: {
                    target: 'category',
                    actions: assign({
                        categories: (_, { categories }) => categories
                    })
                },
                PREV: {
                    target: 'date_and_venue',
                },
                NEXT: {
                    target: 'date',
                }
            }
        },
    }
})
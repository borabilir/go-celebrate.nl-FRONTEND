import { assign, createMachine } from 'xstate'
import MdmClient from '@/apollo/clients/mdm'
import OccasionsQuery from '@/apollo/queries/occasion/occasionsList.gql'
import OfferingQuery from '@/apollo/queries/offering/offering.gql'

export const createQuoteMachine = createMachine({
    id: 'quoteMachine',
    initial: 'idle',
    predictableActionArguments: true,
    context: {
        /* We store our URL qery here */
        query: {},
        locale: null,
        /* Pre-fetched data from MDM */
        categoriesList: [],
        occasionsList: [],
        cuisinesList: [],
        offering: [], // Can have multiple one LATER
        vendor: [], // Can have multiple one LATER
        /* User filled data */
        /* Slide 1 */
        occasion: null,
        /* Slide 2 */
        categories: [],
        /* Slide 3 */
        dateFrom: null,
        dateTo: null,
        /* Slide 4 */
        venue: '',
        /* Slide 5 */
        cuisines: [], // only if food type category is present on the offering
        /* Slide 6 */
        dietPreferenceMessage: '',
        /* Slide 7 */
        numberOfGuests: null,
        budgetPerPerson: null,
        paidBy: null, // Guests or organizer
        eventDetails: '',
        /* Slide 8 */
        /* Optional, only if the per guest budget is not high enough */
        flexibleBudget: false,
        /* Slide 9 */
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        companyName: '',
        termsAcceptedAt: null
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
                        dateFrom: () => new Date()
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
                        const { query = {} } = context
                        let {
                            offering, // Id of a selected offering
                            _start, // Start date
                            _end, // End date
                            _occasion,
                            _category
                        } = query
                        if (_occasion) {
                            // It's better to fetch the occasions and find the one we need because it's cached anyway
                            const { data: { occasions: occasionsData } } = await MdmClient.query({
                                query: OccasionsQuery,
                                variables: {
                                    locale: context.locale
                                }
                            })
                            _occasion = occasionsData.find(o => o.key === _occasion)
                        }
                        if (offering) {
                            const { data: { offering: offeringData } } = await MdmClient.query({
                                query: OfferingQuery,
                                variables: {
                                    id: offering
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
        category: {
            on: {
                SELECT: {
                    target: 'category',
                    actions: assign({
                        categories: (_, { categories }) => categories
                    })
                },
                PREV: {
                    target: 'occasion',
                },
                NEXT: {
                    target: 'date',
                }
            }
        },
        date: {
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
                PREV: {
                    target: 'category',
                },
                NEXT: {
                    target: 'venue',
                }
            }
        },
        venue: {
            on: {
                SET_VENUE: {
                    actions: assign({
                        venue: (_, { venue }) => venue
                    })
                },
                PREV: {
                    target: 'date',
                },
                NEXT: [
                    {
                        // Leave out the cuisine if we have an offering selected
                        target: 'cuisine',
                        cond: (context) => !context.offering || context.offering.length === 0
                    },
                    {
                        target: 'diet'
                    }
                ]
            }
        },
        cuisine: {
            on: {
                SELECT: {
                    actions: assign({
                        cuisines: (_, { cuisines }) => cuisines
                    })
                },
                PREV: {
                    target: 'venue',
                },
                NEXT: {
                    target: 'diet',
                }
            }
        },
        diet: {
            on: {
                SELECT: {
                    actions: assign({
                        dietPreferenceMessage: (_, { diet }) => diet
                    })
                },
                PREV: [
                    {
                        // Leave out the cuisine if we have an offering selected
                        target: 'cuisine',
                        cond: (context) => !context.offering || context.offering.length === 0
                    },
                    {
                        target: 'venue'
                    }
                ],
                NEXT: {
                    target: 'eventDetails',
                }
            }
        },
        eventDetails: {
            on: {
                PREV: {
                    target: 'diet'
                },
                NEXT: {
                    target: 'contactDetails',
                }
            }
        },
        budgetCheck: {

        },
        contactDetails: {
            on: {
                PREV: {
                    target: 'eventDetails'
                },
                SENT: {
                    target: 'complete',
                }
            }
        },
        complete: {
            type: 'final'
        },
    }
})
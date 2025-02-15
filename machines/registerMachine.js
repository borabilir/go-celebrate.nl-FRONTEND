import { assign, createMachine } from 'xstate'
import MdmClient from '@/apollo/clients/mdm'

export const createRegisterMachine = createMachine({
    id: 'registerMachine',
    initial: 'idle',
    context: {
        /* Contact details - User filled data */
        firstName: 'Test',
        lastName: 'Test last',
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
                    target: 'complete'
                }
            }
        },
        fillInfo: {
            on: {
                SUBMITTED: {
                    target: 'complete',
                }
            }
        },
        complete: {
            type: 'final',
            data: {
                user: (context, event) => {
                    console.log(context)
                    console.log(event)
                    return {
                        firstName: context.firstName,
                        lastName: context.lastName,
                        email: context.email,
                        phone: context.phone,
                        companyName: context.companyName,
                        termsAcceptedAt: context.termsAcceptedAt,
                    }
                }
            }
        }
    }
})
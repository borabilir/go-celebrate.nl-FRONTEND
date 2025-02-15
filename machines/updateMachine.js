import { assign, createMachine } from 'xstate'

export const updateMachine = createMachine({
    id: 'updateMachine',
    initial: 'edit',
    context: {
        error: false,
        errorMessage: '',
        quoteData: null,
        data: null // To store whatever data that form step needs
    },
    states: {
        edit: {
            on: {
                DONE: {
                    target: 'done',
                    actions: assign({
                        data: (context, { data }) => data,
                    }),
                },
            },
        },
        done: {
            type: 'final',
            data: {
                data: ({ data }) => data
            }
        },
    },
})
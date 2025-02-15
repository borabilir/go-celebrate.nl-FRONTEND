import { assign, createMachine } from 'xstate'
import MdmClient from '@/apollo/clients/mdm'

export const createEventMachine = createMachine({
    id: 'eventServiceMachine',
    initial: 'idle',
    context: {
        categoryGroupList: [],
        categoryList: [],
        attributeDefinitionsList: [],
        /* User filled data */
        categoryGroup: null, // The flow is to select a category group and then select multiple categories
        categories: [],
        preferences: [], // Elements from the attribute definidion list
        comment: '',
    }
})
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc'
import { client } from '../apollo/clients/mdm'

export const { getClient } = registerApolloClient(() => client)

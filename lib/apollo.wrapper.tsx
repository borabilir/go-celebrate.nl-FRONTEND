'use client'
import { setVerbosity } from 'ts-invariant'
setVerbosity('debug')
import { ApolloNextAppProvider } from '@apollo/experimental-nextjs-app-support/ssr'

import { client } from '@/apollo/clients/mdm'

export function ApolloWrapper({ children }: React.PropsWithChildren) {
    return <ApolloNextAppProvider makeClient={() => client}>{children}</ApolloNextAppProvider>
}

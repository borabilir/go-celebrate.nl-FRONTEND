import { ApolloLink, HttpLink } from '@apollo/client'
import {
    NextSSRApolloClient,
    NextSSRInMemoryCache,
    SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support/ssr'

const httpLink = new HttpLink({ uri: process.env.NEXT_PUBLIC_MDM_GRAPHQL_URL })

export const client = new NextSSRApolloClient({
    link:
        typeof window === 'undefined'
            ? ApolloLink.from([
                  /* new SSRMultipartLink({
                      stripDefer: true,
                  }), */
                  httpLink,
              ])
            : httpLink,
    cache: new NextSSRInMemoryCache({
        /* typePolicies: {
            Query: {
                fields: {
                    offerings: {
                        // Don't cache separate results based on
                        // any of this field's arguments.
                        keyArgs: ['filters', 'sort', 'locale'],

                        // Concatenate the incoming list items with
                        // the existing list items.
                        merge(existing = { data: [] }, incoming, { args: { pagination } }) {
                            const existingOfferings = existing.data
                            const incomingOfferings = incoming.data
                            // Only do this if we really execute a query and not just write to the cache
                            if (pagination && pagination.start) {
                                const merged = existingOfferings ? existingOfferings.slice(0) : []
                                for (let i = 0; i < incomingOfferings.length; ++i) {
                                    merged[pagination.start + i] = incomingOfferings[i]
                                }
                                return {
                                    meta: incoming.meta,
                                    data: merged,
                                }
                            }
                            return incoming
                        },
                    },
                },
            },
        }, */
    }),
})

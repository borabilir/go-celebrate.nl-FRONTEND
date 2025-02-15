/**
 * Entry point of the Next.js application
 *
 * Apollo setup example here: https://www.apollographql.com/blog/apollo-client/next-js/next-js-getting-started/
 *
 */

import React from 'react'
import { useRouter } from 'next/router'
import { appWithTranslation } from 'next-i18next'
import { MantineProvider, createEmotionCache } from '@mantine/core'
import { Provider } from 'jotai'
import { SessionProvider } from 'next-auth/react'
import { ApolloProvider } from '@apollo/client'

import mdmClient from '@/apollo/clients/mdm'

import Globals from '@/cache/globals.json'
import defaultLayout from '@/layouts/default'

import nextI18NextConfig from '../next-i18next.config.js'

/**
 * Importing global and tailwind separately allows quick updates during development.
 * We still can use tailwind's @apply in the global.scss scope.
 * See: https://github.com/vercel/next.js/issues/13488#issuecomment-667496601
 */

import '@/styles/tailwind.scss'
import '@/styles/global.scss'

const mantineStylesCache = createEmotionCache({ key: 'mantine' })
const mantineTheme = {
    fontFamily:
        'RebrandTxt, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    components: {
        Modal: {
            styles: (theme, params) => ({
                close: {
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '32px',
                    height: '32px',
                    svg: {
                        width: '24px',
                        height: '24px',
                    },
                },
                inner: {
                    padding: '16px',
                    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
                        alignItems: 'flex-end',
                    },
                },
                modal: {
                    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
                        margin: '0',
                        height: '100%',
                    },
                },
                body: {
                    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
                        maxHeight: '100%',
                    },
                },
            }),
        },
        Chip: {
            classNames: {
                input: 'peer',
                label: 'rounded-sm peer-checked:bg-dark-blue peer-checked:text-white border peer-checked:border-dark-blue',
                checkIcon: 'text-success',
            },
        },
    },
}

function Gocelebrate({ Component, pageProps: { session, ...pageProps } }) {
    const { asPath, locale } = useRouter()
    /* Idea from here: https://dev.to/ozanbolel/layout-persistence-in-next-js-107g */
    // Set aq default layout, so we don't have to set it on each page
    const Layout = Component.Layout ? Component.Layout : defaultLayout // React.Fragment

    // Pass down the props that contain menu and footer info to the layout
    let layoutProps = {}
    if (pageProps.layoutProps) {
        layoutProps = pageProps.layoutProps
    }
    const LocaleGlobals = Globals[locale]?.content ? Globals[locale]?.content : {}
    return (
        <SessionProvider session={session}>
            <ApolloProvider client={mdmClient}>
                <MantineProvider withGlobalStyles theme={mantineTheme}>
                    <Provider>
                        <Layout {...layoutProps} globals={LocaleGlobals}>
                            <Component {...pageProps} key={`${locale}__${asPath}`} />
                        </Layout>
                    </Provider>
                </MantineProvider>
            </ApolloProvider>
        </SessionProvider>
    )
}
export default appWithTranslation(Gocelebrate, nextI18NextConfig)

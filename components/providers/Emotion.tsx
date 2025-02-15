'use client'

import { useServerInsertedHTML } from 'next/navigation'
import { CacheProvider } from '@emotion/react'
import { MantineProvider, createEmotionCache } from '@mantine/core'

import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '@/tailwind.config'
import React from 'react'

// Grabs the full Tailwind CSS object
const fullConfig = resolveConfig(tailwindConfig)

// Converts the Tailwind colors object into a Mantine colors object. Includes theme colors as well.
// @ts-ignore
const convertedColors = Object.entries(fullConfig.theme?.accentColor || {}).reduce((acc: any, entry: any) => {
    if (entry) {
        const [key, value] = entry
        if (typeof value === 'object') {
            return {
                ...acc,
                [key]: Object.values(value),
            }
        } else {
            return {
                ...acc,
                [key]: value,
            }
        }
    }
}, {})

export const cache = createEmotionCache({
    key: 'mantine',
    prepend: false,
})
cache.compat = true

export default function EmotionProvider({ children }: { children: React.ReactNode }) {
    useServerInsertedHTML(() => (
        <style
            key={cache.key}
            data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
            dangerouslySetInnerHTML={{
                __html: Object.values(cache.inserted).join(' '),
            }}
        />
    ))
    return (
        <CacheProvider value={cache}>
            <MantineProvider
                withGlobalStyles
                emotionCache={cache}
                theme={{
                    fontFamily: 'var(--font-poppins)',
                    colors: {
                        ...convertedColors,
                    },
                    breakpoints: {
                        sm: '40em',
                        md: '48em',
                        lg: '64em',
                        xl: '80em',
                    },
                    components: {
                        TextInput: {
                            defaultProps: {
                                size: 'md',
                            },
                        },
                        DateInput: {
                            defaultProps: {
                                size: 'md',
                            },
                        },
                        DateTimePicker: {
                            defaultProps: {
                                size: 'md',
                            },
                        },
                        Select: {
                            defaultProps: {
                                size: 'md',
                            },
                        },
                        Autocomplete: {
                            defaultProps: {
                                size: 'md',
                            },
                        },
                    },
                }}
            >
                {children}
            </MantineProvider>
        </CacheProvider>
    )
}

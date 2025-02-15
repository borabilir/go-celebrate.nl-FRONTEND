'use client'

/**
 * Read more: https://jotai.org/docs/guides/migrating-to-v2-api#previous-api
 */

import type { ReactNode } from 'react'
import { useHydrateAtoms } from 'jotai/utils'

export const HydrateAtoms = ({ initialValues, children }: { initialValues: Iterable<any>; children: ReactNode }) => {
    // @ts-ignore
    useHydrateAtoms(initialValues)
    return children as unknown as JSX.Element
}

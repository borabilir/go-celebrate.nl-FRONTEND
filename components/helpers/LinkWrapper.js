'use client'
/*
    This component is meant for simplify the usage of next/link
*/
import Link from 'next/link'
import { useLocale } from '@hooks/useLocale'
const NEXT_PUBLIC_DEPLOYMENT_NAME = process.env.NEXT_PUBLIC_DEPLOYMENT_NAME

export default function LinkWrapper(props) {
    const { locale } = useLocale()
    const DEPLOYMENT_URL = `${NEXT_PUBLIC_DEPLOYMENT_NAME}/${locale}`

    let { href = '/', children, ...rest } = props

    return (
        <Link href={typeof href === 'string' ? href.replace(DEPLOYMENT_URL, '') : href} {...rest}>
            {children}
        </Link>
    )
}

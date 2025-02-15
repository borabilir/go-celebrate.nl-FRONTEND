import { NextRequest, NextResponse } from 'next/server'

const defaultLocale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'nl'
let locales = process.env.NEXT_PUBLIC_ACTIVE_LANGUAGES?.split(',') || [defaultLocale]

type PathnameLocale = {
    pathname: string
    locale?: never
}
type ISOLocale = {
    pathname?: never
    locale: string
}

type LocaleSource = PathnameLocale | ISOLocale

const getLocalePartsFrom = ({ pathname, locale }: LocaleSource) => {
    if (locale) {
        const localeParts = locale.toLowerCase().split('-')
        return {
            lang: localeParts[0],
        }
    } else {
        const pathnameParts = pathname!.toLowerCase().split('/')
        return {
            lang: pathnameParts[1],
        }
    }
}

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    const defaultLocaleParts = getLocalePartsFrom({ locale: defaultLocale })
    /**
     * TODO: Rediect if the pathname is not the default locale and missing a valid locale
     */
    const pathnameIsMissingValidLocale = locales.every((locale) => {
        const localeParts = getLocalePartsFrom({ locale })
        return !pathname.startsWith(`/${localeParts.lang}`)
    })
    function getResponseInit() {
        const responseInit = {
            request: {
                headers: request.headers,
            },
        }

        return responseInit
    }
    if (pathnameIsMissingValidLocale) {
        // rewrite it so next.js will render `/` as if it was `/nl`
        return NextResponse.rewrite(new URL(`/${defaultLocaleParts.lang}${pathname}`, request.url), getResponseInit())
    }
}

export const config = {
    // Skip all paths that should not be internationalized. This example skips the
    // folders "api", "_next" and all files with an extension (e.g. favicon.ico)
    matcher: ['/((?!api|_next|.*\\..*).*)'],
}

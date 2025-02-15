export const fallbacklocale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'nl'
export const defaultNS = 'onboarding'
export const locales = process.env.NEXT_PUBLIC_ACTIVE_LANGUAGES?.split(',') || ['nl']

export function getOptions(lng = fallbacklocale, ns = defaultNS) {
    return {
        // debug: true,
        returnNull: false,
        supportedLngs: locales,
        fallbacklocale,
        lng,
        fallbackNS: defaultNS,
        defaultNS,
        ns,
    }
}

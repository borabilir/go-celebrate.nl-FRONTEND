export function useServerLocale(params: any = {}) {
    const { locale } = params
    const defaultLocale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'nl'
    const locales = process.env.NEXT_PUBLIC_ACTIVE_LANGUAGES
        ? process.env.NEXT_PUBLIC_ACTIVE_LANGUAGES.split(',')
        : [defaultLocale]
    /**
     * With this check, we enable to have a root path for the default locale without the
     * locale in the url. This is useful for SEO purposes. So, for example, the default
     * locale is 'nl' and the root path is '/'. This will be the same as '/nl'.
     */
    if (!locales.includes(locale)) {
        /**
         * We're probably on the root path.
         */
        return { locale: defaultLocale }
    }
    return { locale }
}

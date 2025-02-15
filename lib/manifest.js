/*
    Pre-load and save every piece of content we need before build
        - Storyblok website globals (navbar, footer)
        - Translations
*/

const fetchCMSGlobals = require('./storyblok.globals')
const fetchTranslations = require('./mdm.translations')

async function main() {
    await fetchCMSGlobals()
    await fetchTranslations()
}

main()
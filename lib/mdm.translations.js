const fs = require('fs')
const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config()

const NEXT_PUBLIC_ACTIVE_LANGUAGES = process.env.NEXT_PUBLIC_ACTIVE_LANGUAGES || ['nl']
const PROJECT_ROOT = process.cwd() // Next.js recommends this method
const PROJECT_TRANSLATIONS = PROJECT_ROOT + '/translations'
/* We retrieve translations always from the production server, so we don't have to manage/import them in multiple places */
console.log("NEXT_PUBLIC_MDM_PRODUCTION_API_URL", process.env.NEXT_PUBLIC_MDM_PRODUCTION_API_URL)
console.log("NEXT_PUBLIC_MDM_API_URL", process.env.NEXT_PUBLIC_MDM_API_URL)
console.log("NEXT_PUBLIC_BASE_URL", process.env.NEXT_PUBLIC_BASE_URL)

const NEXT_PUBLIC_MDM_PRODUCTION_API_URL =
    process.env.NEXT_PUBLIC_MDM_PRODUCTION_API_URL || process.env.NEXT_PUBLIC_MDM_API_URL

module.exports = async function fetchTranslations() {
    const locales = NEXT_PUBLIC_ACTIVE_LANGUAGES.split(',')
    console.log("Locales type:", typeof locales, "Locales value:", locales);
    try {
        const { data: { data } = {} } = await axios.get(
            `${NEXT_PUBLIC_MDM_PRODUCTION_API_URL}/translations?locale=all&pagination[limit]=-1`
        )
        locales.map((locale) => {
            const nameSpaces = data.reduce((acc, translation) => {
                const { nameSpace } = translation.attributes
                if (acc.indexOf(nameSpace) === -1) acc.push(nameSpace)
                return acc
            }, [])
            nameSpaces.map((nameSpace) => {
                const translations = {}
                data.map((translation) => {
                    if (translation.attributes.locale === locale && translation.attributes.nameSpace === nameSpace) {
                        translations[translation.attributes.key] = translation.attributes.text
                    }
                })
                const cacheFolderExists = fs.existsSync(PROJECT_TRANSLATIONS)
                if (!cacheFolderExists) {
                    fs.mkdirSync(PROJECT_TRANSLATIONS)
                }
                const languageFolderExists = fs.existsSync(`${PROJECT_TRANSLATIONS}/${locale}`)
                if (!languageFolderExists) {
                    fs.mkdirSync(`${PROJECT_TRANSLATIONS}/${locale}`)
                }
                /* common is the defauls namespace per i18next documentation. Later, we might implement more namespaces */
                fs.writeFileSync(
                    `${PROJECT_TRANSLATIONS}/${locale}` + `/${nameSpace}.json`,
                    JSON.stringify(translations),
                    (err) => {
                        if (err) throw err
                        console.info('Global data manifest written to file')
                    }
                )
                console.log(`Translations for saved for ${locale} to public/${locale}/${nameSpace}.json`)
            })
        })
    } catch (error) {
        console.error(error)
    }
}

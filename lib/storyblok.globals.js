/*
    Pre-fetches the page globals (navbar, footer) for each active languages and caches into a .json file.
    Run this function BEFORE the build command.
*/

const fs = require('fs')
const StoryblokClient = require('storyblok-js-client')
const dotenv = require('dotenv')
dotenv.config()

const NEXT_PUBLIC_ACTIVE_LANGUAGES = process.env.NEXT_PUBLIC_ACTIVE_LANGUAGES
const NEXT_PUBLIC_DEPLOYMENT_NAME = process.env.NEXT_PUBLIC_DEPLOYMENT_NAME
const STORYBLOK_ACCESS_TOKEN = process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN
const PROJECT_ROOT = process.cwd() // Next.js recommends this method
const PROJECT_CACHE = PROJECT_ROOT + '/cache'

const Storyblok = new StoryblokClient({
    accessToken: STORYBLOK_ACCESS_TOKEN,
    cache: {
        clear: 'auto',
        type: 'memory',
    },
})

module.exports = async function fetchCMSGlobals() {
    const locales = NEXT_PUBLIC_ACTIVE_LANGUAGES ? NEXT_PUBLIC_ACTIVE_LANGUAGES.split(',') : ['en']
    try {
        const requests = await Promise.all(
            locales.map(async (locale) => {
                /* Make sure the whole process won't fail a global has not been yet created */
                try {
                    const data = await Storyblok.get(`cdn/stories/${NEXT_PUBLIC_DEPLOYMENT_NAME}/${locale}/globals`)
                    return data
                } catch (err) {
                    console.warn(
                        'Globals not found for: ' +
                            locale +
                            '. Create a WebsiteGlobals content type inside the root folder of the locale in Storyblok.'
                    )
                    return {}
                }
            })
        )
        const exists = fs.existsSync(PROJECT_CACHE)
        if (!exists) {
            fs.mkdirSync(PROJECT_CACHE)
        }
        const globals = {}
        locales.map((locale, index) => {
            if (requests[index] && requests[index].data) {
                globals[locale] = requests[index].data.story
            }
        })
        fs.writeFileSync(PROJECT_CACHE + '/globals.json', JSON.stringify(globals), (err) => {
            if (err) throw err
            console.info('Global data manifest written to file')
        })
        console.log('Website globals saved to cache/globals.json')
    } catch (err) {
        console.error(err)
    }
}

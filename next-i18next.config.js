/* https://github.com/isaachinman/next-i18next */

const PROJECT_ROOT = process.cwd()

const path = require('path')

module.exports = {
    i18n: {
        defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'nl',
        locales: process.env.NEXT_PUBLIC_ACTIVE_LANGUAGES
            ? process.env.NEXT_PUBLIC_ACTIVE_LANGUAGES.split('.')
            : ['nl'],
        localePath: path.resolve('./public/locales'),
        reloadOnPrerender: process.env.NODE_END === 'development' ? true : false,
        // localePath: PROJECT_ROOT + '/cache'
    },
}

const { i18n } = require('./next-i18next.config')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
    // i18n,
    typescript: {
        // This is due to https://github.com/vercel/next.js/issues/51026
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
    reactStrictMode: true,
    webpack: (config, { isServer }) => {
        // First of all, clear the cache files before initiating the build
        // resetCache()

        config.module.rules.push({
            test: /\.(graphql|gql)$/,
            exclude: /node_modules/,
            loader: 'graphql-tag/loader',
        })
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack'],
        })
        return config
    },
    /* webpackDevMiddleware: (config) => {
        return config
    }, */
    images: {
        domains: [
            'images.unsplash.com',
            'via.placeholder.com',
            'res.cloudinary.com',
            '*.supabase.co',
            'yuzgedshzpirrfvcbvmx.supabase.co',
        ],
    },
    /* i18n: {
        // These are all the locales you want to support in
        // your application
        locales: process.env.NEXT_PUBLIC_ACTIVE_LANGUAGES ? process.env.NEXT_PUBLIC_ACTIVE_LANGUAGES.split(',') : ['nl'],
        // This is the default locale you want to be used when visiting
        // a non-locale prefixed path e.g. `/hello`
        defaultLocale: 'nl',
        localeDetection: false,
    }, */
    env: {
        // GTM_ID: process.env.GTM_ID
    },
    experimental: { esmExternals: true },
})

/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('./theme/colors.json')

module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './layouts/**/*.{js,ts,jsx,tsx}',
        './app/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            gridTemplateRows: {
                9: 'repeat(9, minmax(0, 1fr))',
            },
            gridRowEnd: {
                8: '8',
                10: '10',
            },
            maxWidth: {
                800: '800px',
            },
            minHeight: {
                '3/4-screen': '75vh',
            },
            boxShadow: {
                sticking: '0 14px 24px -16px rgb(0 0 0 / 20%), 0 10px 9px -11px rgb(0 0 0 / 20%)',
                stickingReverse: '0 -14px 24px -16px rgb(0 0 0 / 20%), 0 -10px 9px -11px rgb(0 0 0 / 20%)',
                'level-2': '0px 2px 4px -2px rgba(0, 0, 0, 0.06), 0px 8px 8px -4px rgba(0, 0, 0, 0.06)',
            },
            colors: {
                link: '#276ED7',
                ...colors,
            },
        },
        fontFamily: {
            title: ['Poppins', ...defaultTheme.fontFamily.sans],
            sans: ['Poppins', ...defaultTheme.fontFamily.sans],
        },
    },
    plugins: [require('@tailwindcss/aspect-ratio'), require('@tailwindcss/forms')],
    safeList: ['list-disc', 'pl-4', 'space-y-1.5', 'heading-2', 'heading-3', 'marker:text-dark-blue-300'],
}

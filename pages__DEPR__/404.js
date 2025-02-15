export default function Custom404() {
    return <h1>404 - Page Not Found</h1>
}

export async function getStaticProps(context) {

    /**
     * In next.js there isn't a great way to include navbar/footer stuff only once, so here we do that for every page
     */
     const layoutProps = {
        navbar: {},
        footer: {
            legal: '© Go Celebrate Benelux B.V.'
        }
    }
    return {
        props: {
            layoutProps
        }
    }
}

import Section from '@/components/Section'
import Container from '@/components/Container'
import BlockImage from '@/components/helpers/BlockImage'
import VendorSearch from '@/components/atoms/VendorSearch'

export default function HomeHero({ blok = {} }) {
    const { image, searchLabel, title } = blok
    return (
        <Section className="relative bg-dark-blue-100">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 190 167"
                width="190"
                height="167"
                className="absolute scale-75 sm:scale-100 sm:block -top-8 sm:-top-4 -left-24 sm:-left-10 lg:-left-16 z-0"
            >
                <g fill="none" fillRule="evenodd">
                    <path
                        d="M76.744 146.436c-6.108 6.108-14.232 9.305-22.876 9.002h-.004a30.985 30.985 0 0 1-3.999-.401l-1.893 11.407c1.813.302 3.66.487 5.49.55 11.713.41 23.18-4.103 31.459-12.382l-8.176-8.177v.001Z"
                        fill="#E13B41"
                    />
                    <path
                        d="M160.122 88.72c-8.638 0-16.643-3.485-22.54-9.812l-.004-.003a30.985 30.985 0 0 1-2.544-3.11l-9.405 6.727a42.539 42.539 0 0 0 3.493 4.27c7.992 8.573 19.292 13.49 31 13.49h.001V88.72Z"
                        fill="#F3A712"
                    />
                    <path
                        d="M61.905 31.734c6.108 6.108 9.305 14.232 9.002 22.877v.004a30.985 30.985 0 0 1-.401 3.999l11.408 1.893c.3-1.813.486-3.66.549-5.49.41-11.713-4.103-23.18-12.381-31.459h-.001l-8.176 8.176Z"
                        fill="#197278"
                    />
                    <path
                        d="M11.563 129.772c0-8.638 3.484-16.643 9.81-22.541l.004-.003a30.985 30.985 0 0 1 3.11-2.544l-6.727-9.405a42.539 42.539 0 0 0-4.27 3.493C4.917 106.764 0 118.064 0 129.772h11.563Z"
                        fill="#85C7F2"
                    />
                    <path
                        d="M177.917.733c0 8.638-3.484 16.643-9.81 22.54l-.004.004a30.954 30.954 0 0 1-3.11 2.544l6.727 9.405a42.591 42.591 0 0 0 4.27-3.494c8.573-7.991 13.49-19.29 13.49-31h-11.563"
                        fill="#FBCAEF"
                    />
                </g>
            </svg>
            <Container className="relative lg:grid lg:grid-cols-12 pb-64 md:pb-24 py-24 2xl:py-36 gap-40 lg:gap-12 xl:max-w-7xl">
                <div className="relative lg:col-span-6 xl:col-span-7 2xl:col-span-6 sm:px-8 lg:pr-0 lg:pl-12 z-10">
                    <h1 className="relative mb-2 text-4xl sm:text-5xl xl:text-6xl text-center lg:text-left font-title font-semibold z-10">
                        {title}
                    </h1>
                    <p className="mb-9 text-lg max-w-lg opacity-60">
                        Go-Celebrate lets you discover and book the best
                        suppliers for your event.
                    </p>
                    <VendorSearch />
                </div>
            </Container>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 147 154"
                width="147"
                height="154"
                className="absolute scale-75 sm:scale-100 sm:block -bottom-24 sm:-bottom-12 right-0 z-10"
            >
                <g fill="none" fillRule="evenodd">
                    <path
                        d="M138.553 133.325c-6.108 6.108-14.232 9.305-22.877 9.001h-.004a30.985 30.985 0 0 1-3.999-.4l-1.893 11.407c1.813.301 3.66.487 5.49.55 11.713.41 23.18-4.103 31.459-12.382l-8.176-8.177Z"
                        fill="#F3A712"
                    />
                    <path
                        d="M46.563 34.772c0-8.638 3.484-16.643 9.81-22.541l.004-.003a30.985 30.985 0 0 1 3.11-2.544L52.76.279a42.539 42.539 0 0 0-4.27 3.493C39.917 11.764 35 23.064 35 34.772h11.563Z"
                        fill="#85C7F2"
                    />
                    <path
                        d="M126.204 94.589c-6.108-6.108-9.305-14.232-9-22.876v-.005c.045-1.331.18-2.676.4-3.998l-11.408-1.893a42.591 42.591 0 0 0-.549 5.489c-.41 11.713 4.102 23.18 12.381 31.459l8.176-8.176"
                        fill="#FBCAEF"
                    />
                    <path
                        d="M35.256 114.963c-8.638 0-16.643-3.484-22.541-9.811l-.003-.003a30.985 30.985 0 0 1-2.544-3.111l-9.405 6.728a42.539 42.539 0 0 0 3.493 4.27c7.992 8.573 19.292 13.49 31 13.49v-11.563Z"
                        fill="#197278"
                    />
                </g>
            </svg>
            {image && image.filename && (
                <div className="absolute inset-y-0 right-0 md:w-1/2 overflow-hidden md:rounded-r-lg flex items-end justify-end pb-8">
                    <svg
                        width="656"
                        height="404"
                        viewBox="0 0 656 404"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full h-auto -mb-24 lg:mb-0"
                    >
                        <defs>
                            <clipPath id="homeClipPath">
                                <path d="M229.201 373.559L229.331 373.54C374.292 347.765 519.03 355.11 655.5 393.655V27.0038C495.695 -5.19965 329.719 -7.88534 166.633 21.1096C110.839 30.9906 55.0349 44.6979 0.775391 61.8119L108.384 403.23C147.953 390.72 188.616 380.774 229.201 373.559Z" />
                            </clipPath>
                        </defs>
                        <image
                            xlinkHref={image.filename}
                            alt="Hero image"
                            clipPath="url(#homeClipPath)"
                            width="656"
                        />
                    </svg>
                </div>
            )}
        </Section>
    )
}

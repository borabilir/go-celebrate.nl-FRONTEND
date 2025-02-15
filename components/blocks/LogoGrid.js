import Image from "next/legacy/image"

import Section from '@/components/Section'
import Container from '@/components/Container'

export default function LogoGrid({ blok = {} }) {
    const { title, subtitle, images } = blok
    return (
        <Section className="bg-white py-6 md:py-12">
            <Container>
                <div className="max-w-xl mx-auto sm:text-center">
                    {title && <h2 className="heading-2">{title}</h2>}
                    {subtitle && (
                        <p className="mt-6 md:text-lg md:font-medium">
                            {subtitle}
                        </p>
                    )}
                </div>
                <div className="grid grid-cols-3 gap-8 md:gap-16 lg:gap-20 md:grid-cols-6 lg:grid-cols-5 mt-12">
                    {images &&
                        images.map((image, index) => (
                            <div
                                key={`${image.ilename || image.path}-${index}`}
                                className="relative max-w-[120px] col-span-1 aspect-w-4 aspect-h-3 flex justify-center md:col-span-2 lg:col-span-1"
                            >
                                <Image
                                    className="object-contain mx-auto"
                                    src={image.filename || image.path}
                                    layout="fill"
                                    alt="Logo"
                                />
                            </div>
                        ))}
                </div>
            </Container>
        </Section>
    )
}

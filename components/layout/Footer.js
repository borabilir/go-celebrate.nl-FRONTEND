import Image from 'next/legacy/image'

import Section from '@/components/Section'
import Container from '@/components/Container'
import LinkGroup from '@/components/LinkGroup'
import RichText from '@/components/blocks/RichText'

export function Footer({ globals }) {
    const {
        companyName,
        companyAddress,
        companyCity,
        companyZip,
        companyCountry,
        termsAndConditions,
        privacyPolicy,
        footerLinkGroups = [],
        footerTextGroups = [],
        sitePhoneNumbers = [],
    } = globals
    const date = new Date()
    const year = date.getFullYear()
    return (
        <footer className="text-default mt-16 md:mt-20 font-sans">
            <Section>
                <div className="border-t border-dark-blue-100"></div>
                <Container className="grid md:grid-cols-12 gap-6 py-10 md:py-12">
                    <div className="md:col-span-6 xl:col-span-2 order-last md:order-first text-center">
                        <Image
                            src="/images/google-five-star.jpg"
                            alt="Five star reviews in Google"
                            width={134}
                            height={81}
                        />
                        <Image
                            src="/images/horeca-nederland.jpg"
                            alt="HORECA Nederland Logo"
                            width={134}
                            height={134}
                        />
                    </div>
                    <div className="md:col-span-6 xl:col-span-3 space-y-6">
                        {footerLinkGroups.map((linkGroup) => (
                            <LinkGroup {...linkGroup} key={linkGroup._uid} />
                        ))}
                    </div>
                    <div className="md:col-span-6 xl:col-span-3">
                        {footerTextGroups.map(
                            (textGroup) =>
                                textGroup.text && <RichText key={textGroup._uid} blok={{ text: textGroup.text }} />
                        )}
                    </div>
                    <div className="md:col-span-6 xl:col-span-4">
                        <h3 className="heading-3 opacity-60 mb-4">Contact</h3>
                        <div className="mb-2 font-title font-bold opacity-60">{companyName}</div>
                        <p className="opacity-60">{companyAddress}</p>
                        <p className="mb-6 opacity-60">
                            {companyZip} {companyCity}, {companyCountry}
                        </p>
                        {sitePhoneNumbers?.length > 0 && (
                            <div className="space-y-1.5">
                                {sitePhoneNumbers.map((phone) => (
                                    <div key={phone._uid} className="flex items-center gap-4">
                                        <div className="font-semibold">{phone.languagePrefix}</div>
                                        {phone.phoneNumber && (
                                            <a href={`tel:${phone.phoneNumber.replace('(0)', '')}`}>
                                                {phone.phoneNumber}
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Container>
            </Section>
            <div className="bg-dark-blue-100 py-10">
                <Section className="border-t border-dark-blue-100">
                    <Container>
                        ©{year} {companyName} All Rights Reserved.
                    </Container>
                </Section>
            </div>
        </footer>
    )
}

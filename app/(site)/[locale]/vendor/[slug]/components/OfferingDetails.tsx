'use client'
import Link from 'next/link'
import Image from 'next/legacy/image'
import { useState, useEffect, useRef } from 'react'
import cn from 'classnames'

import AnchorScroll from '@/components/atoms/AnchorScroll'
import Section from '@/components/Section'
import Container from '@/components/Container'
import PotoGrid from '@/components/PotoGrid'
import Markdown from '@/components/Markdown'
import SanitizeHtml from '@/components/SanitizeHtml'
import OfferingAttribute from '@/components/OfferingAttribute'
import GetQuoteBlock from '@/components/GetQuoteBlock'

export function OfferingDetails({ data = {} as any }) {
    const infoBar = useRef<HTMLUListElement>()
    const [infoInView, setInfoInView] = useState()
    const [overInView, setOverInView] = useState()
    const [vendorInView, setVendorInView] = useState()
    const [infoBarSticking, setInfoBarSrticking] = useState<boolean>(false)

    useEffect(() => {
        if (!infoBar.current) return
        const observer = new IntersectionObserver(([e]) => setInfoBarSrticking(e.intersectionRatio < 1), {
            threshold: [1],
        })
        observer.observe(infoBar.current)
        return () => {
            if (observer) {
                observer.disconnect()
            }
        }
    }, [])

    if (!data)
        return (
            <Section className="pt-12 lg:pt-20">
                <Container>
                    <p>No offering found</p>
                </Container>
            </Section>
        )
    const {
        id: string,
        attributes: { name, categories, description, occasions, offeringAttributes, vendor },
    } = data

    return (
        <>
            <Section className="pt-8">
                <Container>
                    <h1 className="heading-2">{name}</h1>
                    {categories && categories.data && (
                        <ul className="flex gap-2 items-center flex-wrap mt-2">
                            {categories.data.map((category: any, index: number) => {
                                return (
                                    <li key={category.id} className=" text-gray-400">
                                        {category.attributes.name}
                                        {index + 1 < categories.data.length && (
                                            <span className="ml-2 text-gray-200">•</span>
                                        )}
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                    <PotoGrid {...data.attributes} key="photo-grid" className="mt-6" />

                    <div className="grid md:grid-cols-4 mt-6 md:mt-12 gap-8 lg:gap-14">
                        {/* BOOK NOW / This appears on the right side on desktop */}
                        <div className="md:col-span-2 lg:px-6 xl:px-8">
                            <div className="sticky top-4">
                                <GetQuoteBlock offering={data} />
                            </div>
                        </div>

                        {/* OFFERING INFO */}
                        <div className="md:col-span-2 md:order-first">
                            <ul
                                // @ts-ignore
                                ref={infoBar}
                                className={cn(
                                    'sticky -top-px flex items-center flex-wrap pt-2 font-medium border-b border-dark-blue-100 mb-8 bg-white bg-opacity-40 backdrop-filter backdrop-blur-md',
                                    infoBarSticking && 'shadow-sticking -mx-6 px-6'
                                )}
                            >
                                <li
                                    className={cn(
                                        'py-2 px-3 md:px-5',
                                        overInView && 'border-b-2 border-black font-semibold'
                                    )}
                                >
                                    <AnchorScroll href="#over">Over</AnchorScroll>
                                </li>
                                <li
                                    className={cn(
                                        'py-2 px-3 md:px-5',
                                        infoInView && 'border-b-2 border-black font-semibold'
                                    )}
                                >
                                    <AnchorScroll href="#info">Info</AnchorScroll>
                                </li>
                                <li
                                    className={cn(
                                        'py-2 px-3 md:px-5',
                                        vendorInView && 'border-b-2 border-black font-semibold'
                                    )}
                                >
                                    <AnchorScroll href="#vendor">Vendor</AnchorScroll>
                                </li>
                                {/* <li className={cn('py-2 px-3 md:px-5', false && 'border-b-2 border-black font-semibold')}>
                                <a href="#menu">Menu</a>
                            </li> */}
                            </ul>
                            <div id="over" />
                            <SanitizeHtml>{description}</SanitizeHtml>
                            {/* INFO */}
                            {/* <div id="info"></div> */}
                            <div className="mt-8">
                                {
                                    /* Print out attributes */
                                    offeringAttributes &&
                                        offeringAttributes.data &&
                                        offeringAttributes.data.map((attribute: any, index: number) => (
                                            <OfferingAttribute
                                                key={attribute.id}
                                                last={index === offeringAttributes.data.length - 1}
                                                {...attribute.attributes}
                                            />
                                        ))
                                }
                            </div>
                            <div className="mb-8 border-b border-dark-blue-100"></div>
                            {/* <Markdown>
                        </Markdown> */}
                            {/* VENDOR */}
                            <div id="vendor"></div>
                            {vendor && vendor.data && (
                                <div className="mt-16 md:mt-20 px-6 py-12 md:p-12 bg-dark-blue-100 rounded-lg">
                                    {vendor.data.attributes.logo.data && (
                                        <div className="relative rounded-full w-16 h-16 md:w-20 md:h-20 -mt-20 md:-mt-[88px] mb-6 ring-8 ring-white bg-white overflow-hidden">
                                            <Image
                                                className="object-cover"
                                                layout="fill"
                                                src={vendor.data.attributes.logo.data.attributes.url}
                                                alt={
                                                    vendor.data.attributes.logo.data.attributes.alternativeText ||
                                                    vendor.data.attributes.name
                                                }
                                            />
                                        </div>
                                    )}
                                    <h4 className="heading-3">{vendor.data.attributes.name}</h4>
                                    {vendor.data.attributes.introduction && (
                                        <SanitizeHtml className="mt-2">
                                            {vendor.data.attributes.introduction}
                                        </SanitizeHtml>
                                    )}
                                </div>
                            )}
                            {/* EVENTUAL MENU */}
                            <div id="menu"></div>
                            {/* RELATED OFFERINGS FROM THE SAME VENDOR */}
                        </div>
                    </div>
                </Container>
            </Section>
        </>
    )
}

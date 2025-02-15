import cn from 'classnames'
import Section from '@/components/Section'
import Container from '@/components/Container'
import OccasionSearch from '@/components/atoms/OccasionSearch'
import BlockImage from '@/components/helpers/BlockImage'

import PhoneIcon from '@/components/icons/PhoneIcon'
import MailIcon from '@/components/icons/MailIcon'

export default function GetQuote({
    blok
}) {
    const {
        title,
        label,
        hint,
        phone,
        phoneTitle,
        email,
        emailTitle,
        background,
        backgroundImage = {}
    } = blok
    return (
        <Section
            className={
                cn(
                    'relative md:text-center py-14',
                    background === 'dark' && 'bg-default text-white',
                    background === 'light' && 'bg-dark-blue-100'
                )
            }
        >
            <Container
                className="px-4 relative z-10"
            >
                <h2
                    className={
                        cn(
                            'heading-2 mb-6 md:mb-8',
                            background === 'dark' && 'text-light-blue',
                        )
                    }
                >
                    { title }
                </h2>
                <div
                    className={
                        cn(
                            'w-full md:w-80 mx-auto pb-12 md:pb-0 mb-12 border-b md:border-b-0 border-opacity-30',
                            background === 'dark' ? 'md:border-dark-blue-100' : 'border-default',
                        )
                    }
                >
                    <OccasionSearch
                        className="w-full text-default mb-3.5"
                        searchLabel={label}
                    />
                    <p className="text-sm opacity-75 md:px-2">{hint}</p>
                </div>
                <div className="md:flex md:max-w-lg md:mx-auto space-y-8 md:space-y-0">
                    { (phoneTitle || phone) && <div
                        className={
                            cn(
                                'relative flex-1 flex items-center justify-between md:justify-center md:pr-4 md:border-r md:border-opacity-30',
                                background === 'dark' ? 'md:border-dark-blue-100' : 'md:border-default',
                            )
                        }
                    >
                        <div>
                            <div
                                className={
                                    cn(
                                        'mb-1 md:mb-3',
                                        background === 'dark' && 'text-light-blue',
                                    )
                                }
                            >
                                {phoneTitle}
                            </div>
                            <a
                                href={`tel:${phone}`}
                                target="_blank"
                                className="text-sm opacity-75"
                                rel="noreferrer"
                            >
                                {phone}
                                <span aria-hidden="true" className="absolute inset-0" />
                            </a>
                        </div>
                        <div
                            className={
                                cn(
                                    'md:hidden flex items-center justify-center w-11 h-11',
                                    background === 'dark' && 'bg-light-blue text-default rounded-full',
                                    background === 'light' && 'bg-default text-dark-blue-100 rounded-full',
                                )
                            }
                        >
                            <PhoneIcon/>
                        </div>
                    </div>}
                    { (emailTitle || email) && <div className="relative flex-1 flex items-center justify-between md:justify-center md:pl-4">
                        <div>
                            <div
                                className={
                                    cn(
                                        'mb-1 md:mb-3',
                                        background === 'dark' && 'text-light-blue',
                                    )
                                }
                            >
                                {emailTitle}
                            </div>
                            <a
                                href={`mailto:${email}`}
                                target="_blank"
                                className="text-sm opacity-75"
                                rel="noreferrer"
                            >
                                {email}
                                <span aria-hidden="true" className="absolute inset-0" />
                            </a>
                        </div>
                        <div
                            className={
                                cn(
                                    'md:hidden flex items-center justify-center w-11 h-11',
                                    background === 'dark' && 'bg-light-blue text-default rounded-full',
                                    background === 'light' && 'bg-default text-dark-blue-100 rounded-full',
                                )
                            }
                        >
                            <MailIcon/>
                        </div>
                    </div>}
                </div>
            </Container>
            { backgroundImage && backgroundImage.filename &&  <BlockImage layout="fill" className="object-cover" image={backgroundImage} /> }
            <img
                className={cn(
                    'hidden md:block absolute -top-10 -left-4 md:left-6 lg:left-10 xl:left-32'
                )}
                src={`/images/confetti/image-decorator-option-1.svg`}
                alt="confetti"
            />
            <img
                className={cn(
                    'absolute -bottom-10 right-4 md:right-6 lg:right-10 xl:right-32'
                )}
                src={`/images/confetti/image-decorator-option-2.svg`}
                alt="confetti"
            />
        </Section>
    )
}
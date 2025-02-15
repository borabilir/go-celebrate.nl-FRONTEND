import { useState } from 'react'
import Head from 'next/head'
import {
    LoadingOverlay,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useForm } from '@mantine/form'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
    useQuery,
    useMutation
} from '@apollo/client'

import landingLayout from '@/layouts/landing'
import TextField from '@/components/form/TextField'
import Button from '@/components/atoms/Button'
import RichTextEditor from '@/components/RichTextEditor'

import VendorQuery from '@/apollo/queries/vendor/vendor.gql'
import updateVendorMutation from '@/apollo/mutations/vendor/updateVendor.gql'
import createTicketMutation from '@/apollo/mutations/ticket/createTicket.gql'
import createTicketMessageMutation from '@/apollo/mutations/ticket/createTicketMessage.gql'

import {
    BiCheckCircle,
    BiLinkExternal,
    BiPlus,
    BiTrash,
    BiXCircle
} from 'react-icons/bi'
import { RiQuestionnaireLine } from 'react-icons/ri'

export default function VendorCheck({
    id,
    token,
    response
}) {
    const [submitted, setSubmitted] = useState(false)
    const [message, setMessage] = useState('')
    const [saveVendor, { data: updatedVendor, loading: saving, error: saveError }] = useMutation(updateVendorMutation)
    const [createTicket, { data: savedTicket, loading: ticketSaving, error: ticketSaveError }] = useMutation(createTicketMutation)
    const [createTicketMessage, { data: savedTicketMessage, loading: ticketMessageSaving, error: ticketMessageSaveError }] = useMutation(createTicketMessageMutation)

    const { t } = useTranslation()
    const form = useForm({
        initialValues: {
            email: '',
            phone: '',
            name: '',
            website: '',
            facebook: '',
            instagram: '',
            contact: [],
            message: ''
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    })
    const { data: { vendor } = {}, loading, error } = useQuery(VendorQuery, {
        variables: {
            id
        },
        onCompleted({ vendor }) {
            if (response === 'true' && vendor?.data?.attributes) {
                form.setValues({
                    status: response === 'true' ? 1 : 4, // 1: Partner, 4: Rejected
                    email: vendor.data.attributes.email,
                    phone: vendor.data.attributes.phone,
                    name: vendor.data.attributes.name,
                    website: vendor.data.attributes.website,
                    facebook: vendor.data.attributes.facebook,
                    instagram: vendor.data.attributes.instagram,
                    contact: vendor.data.attributes.contact.map(c => {
                        const tmp = {...c}
                        delete tmp.__typename
                        return tmp
                    }),
                })
                // Save vendor's positive answer
                saveVendor({
                    variables: {
                        id: vendor.data.id,
                        data: {
                            status: 1 // Partner
                        },
                        locale: vendor.data.attributes.locale
                    },
                    context: {
                        headers: {
                            'Authorization': 'Bearer 5da6497d2cc695c868cb749e7096f18ff69e875e4a458905a14f4428f2ea54ef846cdd8f2a9773178e6d60ad94bb3c058d446e1bcbe114906a7d47e7df05cec99cc9e4eb570bd5c8a43e23a3217e50f2ec9e6c97806a5728b18de20bba835de05db9c426c92ceed1501780578668164d83b2915dc93db8704e578d68169adc9d'
                        },
                    }
                })
            } else if (response === 'false') {
                // Just set the status to rejected (id: 4) and save the vendor
                saveVendor({
                    variables: {
                        id: vendor.data.id,
                        data: {
                            status: 4
                        },
                        locale: vendor.data.attributes.locale
                    },
                    context: {
                        headers: {
                            'Authorization': 'Bearer 5da6497d2cc695c868cb749e7096f18ff69e875e4a458905a14f4428f2ea54ef846cdd8f2a9773178e6d60ad94bb3c058d446e1bcbe114906a7d47e7df05cec99cc9e4eb570bd5c8a43e23a3217e50f2ec9e6c97806a5728b18de20bba835de05db9c426c92ceed1501780578668164d83b2915dc93db8704e578d68169adc9d'
                        },
                    }
                })
            }
        }
    })
    function sendData(data) {
        saveVendor({
            variables: {
                id: vendor.data.id,
                data: {
                    status: data.status,
                    email: data.email,
                    phone: data.phone,
                    name: data.name,
                    website: data.website,
                    facebook: data.facebook,
                    instagram: data.instagram,
                    contact: data.contact
                },
                locale: vendor.data.attributes.locale
            },
            context: {
                headers: {
                    'Authorization': 'Bearer 5da6497d2cc695c868cb749e7096f18ff69e875e4a458905a14f4428f2ea54ef846cdd8f2a9773178e6d60ad94bb3c058d446e1bcbe114906a7d47e7df05cec99cc9e4eb570bd5c8a43e23a3217e50f2ec9e6c97806a5728b18de20bba835de05db9c426c92ceed1501780578668164d83b2915dc93db8704e578d68169adc9d'
                },
            },
            onCompleted(data) {
                console.log('data', data)
                setSubmitted(true)
                showNotification({
                    title: 'Success!',
                    message: 'Your details has been saved.',
                    color: 'green',
                    icon: <BiCheckCircle />
                })
            },
            onError(error) {
                console.error(error)
                showNotification({
                    title: 'Oops!',
                    message: 'Something went wrong.',
                    color: 'red',
                    icon: <BiXCircle />
                })
            }
        })

        // Don't create a ticket if there's no message
        if (!message) return

        createTicket({
            variables: {
                data: {
                    firstName: vendor.data.attributes.name,
                    email: vendor.data.attributes.email,
                    phone: vendor.data.attributes.phone,
                    vendor: vendor.data.id
                }
            },
            context: {
                headers: {
                    'Authorization': 'Bearer 5da6497d2cc695c868cb749e7096f18ff69e875e4a458905a14f4428f2ea54ef846cdd8f2a9773178e6d60ad94bb3c058d446e1bcbe114906a7d47e7df05cec99cc9e4eb570bd5c8a43e23a3217e50f2ec9e6c97806a5728b18de20bba835de05db9c426c92ceed1501780578668164d83b2915dc93db8704e578d68169adc9d'
                },
            },
            onCompleted(data) {
                const ticketId = data?.createTicket?.data?.id
                if (ticketId) {
                    createTicketMessage({
                        variables: {
                            data: {
                                ticket: ticketId,
                                direction: 'incoming',
                                from: vendor.data.attributes.email,
                                message
                            },
                        },
                        context: {
                            headers: {
                                'Authorization': 'Bearer 5da6497d2cc695c868cb749e7096f18ff69e875e4a458905a14f4428f2ea54ef846cdd8f2a9773178e6d60ad94bb3c058d446e1bcbe114906a7d47e7df05cec99cc9e4eb570bd5c8a43e23a3217e50f2ec9e6c97806a5728b18de20bba835de05db9c426c92ceed1501780578668164d83b2915dc93db8704e578d68169adc9d'
                            },
                        },
                        onCompleted(data) { console.log(data) }
                    })
                }
            },
            onError(error) {
                console.error('TTicket wasnt created', error)
            }
        })
    }
    return (
        <>
            <Head>
                <title>Go Celebrate | Controleer je gegevens</title>
            </Head>
            <div className="flex-1 xl:overflow-y-auto">
                <div className="relative max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:py-12 lg:px-8">
                    <LoadingOverlay visible={loading} overlayBlur={2} />
                    { !loading && (
                        <div className="text-green p-4 md:px-6 md:py-10 text-center bg-green bg-opacity-10 rounded-lg">
                            <BiCheckCircle className='mx-auto w-10 h-10 mb-3' />
                            <span className='text-xl sm:text-3xl font-extrabold'>{t('thank_you', { ns: 'admin' })}</span>
                            <br />
                            { response === 'false' && t('we_will_remove_your_soon', { ns: 'admin' }) }
                        </div>
                    )}
                    {
                        response === 'true' && (
                            <>
                                <h2 className='heading-2 mt-8'>{t('review_your_info', { ns: 'admin' })}</h2>
                                <form className="mt-6 space-y-8 divide-y divide-y-blue-gray-200" onSubmit={form.onSubmit(sendData)}>
                                    <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6 pt-6">
                                        <h3 className="heading-3 sm:col-span-6">{t('business_details', { ns: 'admin' })}</h3>
                                        <div className="sm:col-span-6">
                                            <TextField
                                                label={t('company_name')}
                                                name="name"
                                                required
                                                {...form.getInputProps('name')}
                                            />
                                        </div>
                                        <div className="sm:col-span-3">
                                            <TextField
                                                label="Website"
                                                name="website"
                                                {...form.getInputProps('website')}
                                            />
                                        </div>
                                        <div className="sm:col-span-3">
                                            <TextField
                                                label="Facebook"
                                                name="facebook"
                                                type="facebook"
                                                {...form.getInputProps('facebook')}
                                            />
                                        </div>
                                        <div className="sm:col-span-3">
                                            <TextField
                                                label="Instagram"
                                                name="instagram"
                                                {...form.getInputProps('instagram')}
                                            />
                                        </div>

                                    </div>
                                    <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6 pt-6">
                                        <h3 className="heading-3 sm:col-span-6">{t('business_contact_details', { ns: 'admin' })}</h3>
                                        <div className="sm:col-span-3">
                                            <TextField
                                                label={t('email')}
                                                name="email"
                                                type="email"
                                                required
                                                {...form.getInputProps('email')}
                                            />
                                        </div>
                                        <div className="sm:col-span-3">
                                            <TextField
                                                label={t('phone')}
                                                name="phone"
                                                required
                                                {...form.getInputProps('phone')}
                                            />
                                        </div>

                                    </div>

                                    <div className="pt-6">
                                        <h3 className="heading-3 sm:col-span-6 mb-6">{t('contactperson', { count: form.values?.contact?.length || 1, ns: 'admin' })}</h3>
                                        <div className="space-y-4">
                                            {
                                                form.values.contact.map((contact, index) => (
                                                    <div
                                                        className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6 p-4 bg-dark-blue-50 rounded-lg"
                                                        key={contact.id}
                                                    >
                                                        <div className="sm:col-span-3">
                                                            <TextField
                                                                label={t('first_name')}
                                                                name="first-name"
                                                                dense
                                                                required
                                                                {...form.getInputProps(`contact.${index}.firstName`)}
                                                            />
                                                        </div>
                                                        <div className="sm:col-span-3">
                                                            <TextField
                                                                label={t('last_name')}
                                                                name="last-name"
                                                                dense
                                                                required
                                                                {...form.getInputProps(`contact.${index}.lastName`)}
                                                            />
                                                        </div>
                                                        <div className="sm:col-span-3">
                                                            <TextField
                                                                label={t('email')}
                                                                name="email"
                                                                type="email"
                                                                dense
                                                                required
                                                                {...form.getInputProps(`contact.${index}.email`)}
                                                            />
                                                        </div>
                                                        <div className="sm:col-span-3">
                                                            <TextField
                                                                label={t('phone')}
                                                                name="phone"
                                                                dense
                                                                required
                                                                {...form.getInputProps(`contact.${index}.phone`)}
                                                            />
                                                        </div>
                                                        <div className="sm:col-start-4 sm:col-span-3 text-right">
                                                            <button
                                                                className='text-sm font-semibold inline-flex items-center'
                                                                onClick={() => form.removeListItem('contact', index)}
                                                            >
                                                                <BiTrash className='mr-2'/>
                                                                {t('remove')}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                            <Button
                                                blok={{
                                                    dense: true,
                                                    variant: 'secondary'
                                                }}
                                                onClick={() => form.insertListItem('contact', {
                                                    firstName: '',
                                                    lastName: '',
                                                    email: '',
                                                    phone: ''
                                                })}
                                            >
                                                <BiPlus className='mr-2'/>
                                                {t('add_contact_person', { ns: 'admin' })}
                                            </Button>
                                        </div>
                                    </div>

                                    {
                                        vendor?.data?.attributes?.legacyPortfolioPage && (
                                            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6 pt-6">
                                                <div className="sm:col-span-6">
                                                    <h3 className="heading-3">{t('portfolio')}</h3>
                                                    <p className='mb-3'>{t('review_current_portfolio', { ns: 'admin' })}</p>
                                                    <Button
                                                        blok={{
                                                            dense: true,
                                                            variant: 'secondary',
                                                            target: {
                                                                linktype: 'url',
                                                                url: vendor.data.attributes.legacyPortfolioPage
                                                            }
                                                        }}
                                                    >
                                                        {t('review_portfolio_cta', { ns: 'admin' })}
                                                        <BiLinkExternal className='ml-2' />
                                                    </Button>

                                                    <div className='mt-10 md:text-base font-semibold text-default mb-1.5'>
                                                        <div className='flex items-center justify-center w-10 h-10 rounded bg-classic-rose'>
                                                            <RiQuestionnaireLine className='w-6 h-6' />
                                                        </div>
                                                        {t('something_not_right_message_us', { ns: 'admin' })}
                                                    </div>

                                                    <RichTextEditor
                                                        id="message"
                                                        value={message}
                                                        onChange={setMessage}
                                                        placeholder={t('type_message_placeholder')}
                                                        controls={[
                                                            ['bold', 'italic', 'underline', 'link']
                                                        ]}
                                                        className='font-sans'
                                                    />

                                                    {/* <TextArea
                                                        label={t('something_not_right_message_us', { ns: 'admin' })}
                                                        placeholder={t('type_message_placeholder')}
                                                        className='mt-6'
                                                        minRows={6}
                                                        {...form.getInputProps('message')}
                                                    /> */}
                                                </div>
                                            </div>
                                        )
                                    }

                                    <div className="pt-8 flex justify-end">
                                        {
                                            submitted ? (
                                                <Button
                                                    blok={{
                                                        variant: 'secondary',
                                                        dense: true
                                                    }}
                                                    className='pointer-events-none'
                                                >
                                                    <BiCheckCircle className='mr-2' />
                                                    Success
                                                </Button>
                                            ) : (<Button
                                                blok={{
                                                    variant: 'primary',
                                                    dense: true
                                                }}
                                                type='submit'
                                            >
                                                {t('save')}
                                            </Button>)
                                        }
                                    </div>
                                </form>
                            </>
                        )
                    }
                </div>
            </div>

        </>
    )
}

export async function getServerSideProps({ req, res, query, locale, params }) {
    const {
        token = null,
        response = null
    } = query
    const {
        id = null
    } = params
    return {
        props: {
            id,
            token,
            response,
            ...(await serverSideTranslations(locale, ['common', 'admin', 'quote'])),
        }
    }
}

VendorCheck.Layout = landingLayout
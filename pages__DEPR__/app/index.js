import client from '@/apollo/clients/mdm'
import { useSession } from 'next-auth/react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import dashboardLayout from '@/layouts/dashboard'
import MyEventsQuery from '@/apollo/queries/event/myEventsQuery.gql'
import EventCard from '@/components/dashboard/EventCard'

import { logWithContext } from '@/utils/logger' 

logWithContext('index.js: ', 'This file is loaded - pages__DEPR__/app');

export default function Dashboard({ events, meta, fetchError }) {
    const { t } = useTranslation(['common'])
    const {
        data: { user },
        status,
    } = useSession()
    if (process.env.NEXT_PUBLIC_INFO_LOGGING_MODE === 'true') {
        console.log(meta)
    }
    return (
        <div className="grow max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="heading-2 mt-12 mb-12">
                {t('your_events', ['common'])}, {user?.firstName}
            </h1>
            <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-gray-400">
                    {meta.pagination.total} {t('event', { count: parseInt(meta.pagination.total) })}
                </div>
            </div>
            {events && events.length > 0 && (
                <ul className="space-y-3">
                    {events.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </ul>
            )}
        </div>
    )
}

Dashboard.Layout = dashboardLayout

export async function getServerSideProps({ req, res, locale }) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    const { jwt } = session.user
    let result = null
    let fetchError = null
    try {
        const {
            data: { myEvents },
        } = await client.query({
            query: MyEventsQuery,
            variables: {
                sort: 'startDate:desc',
            },
            context: {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            },
        })
        if (!myEvents) {
            throw new Error('No events found')
        }
        result = myEvents
    } catch (error) {
        fetchError = error
    }
    return {
        props: {
            session,
            fetchError: JSON.stringify(fetchError),
            events: result.data,
            meta: result.meta,
            ...(await serverSideTranslations(locale, ['common'])),
        },
    }
}

import { Navbar } from '@mantine/core'
import NavigationLink from '@/components/dashboard/NavigationLink'
import UserCard from '@/components/dashboard/UserCard'

import {
    FiActivity
} from 'react-icons/fi'

export default function DashboardNavigation({}) {
    return (
        <>
            <Navbar.Section
                className="-mx-4 -mt-4"
            >
                <UserCard />
            </Navbar.Section>
            <Navbar.Section grow mt="md">
                <NavigationLink
                    icon={<FiActivity />}
                >
                    Helloooo
                </NavigationLink>
            </Navbar.Section>
            <Navbar.Section>
                Log out...
            </Navbar.Section>
        </>
    )
}
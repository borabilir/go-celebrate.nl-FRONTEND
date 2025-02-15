import { ThemeIcon, Group, Text } from '@mantine/core'

import LinkWrapper from '@/components/helpers/LinkWrapper'


export default function DashboardNavigationLink({
    children,
    icon,
    color = 'blue'
}) {
    return (
        <LinkWrapper
            className="flex items-center py-1 gap-4 hover:bg-gray-100 transition-colors duration-200"
        >
            {icon && <div
                className="p-2 bg-dark-blue-50 rounded-sm"
            >
                {icon}
            </div>}
            <Text size="sm">{children}</Text>
        </LinkWrapper>
    )
}
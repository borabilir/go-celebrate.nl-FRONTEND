import LinkWrapper from '@/components/helpers/LinkWrapper'

import {
    UnstyledButton,
    Group,
    Avatar,
    Text,
    Box
} from '@mantine/core'

import {
    FiChevronRight,
} from 'react-icons/fi'

export default function User() {
    return (
        <div
            className="border-b border-gray-200"
        >
            <LinkWrapper
                className="block w-full p-4 md:p-5 hover:bg-gray-100 transition-colors duration-200"
                href="/app/profile"
            >
                <Group>
                    <Avatar
                        src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
                        radius="xl"
                    />
                    <Box sx={{ flex: 1 }}>
                        <Text size="sm" weight={500}>
                            Amy Horsefighter
                        </Text>
                        <Text color="dimmed" size="xs">
                            ahorsefighter@gmail.com
                        </Text>
                    </Box>

                    <FiChevronRight size={18} />
                </Group>
            </LinkWrapper>
        </div>
    )
}
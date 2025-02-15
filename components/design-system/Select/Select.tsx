import cn from 'classnames'
import { get } from 'lodash'
import { Select as MantineSelect, type SelectProps as MantineSelectProps, type SelectItem } from '@mantine/core'
import { useMemo } from 'react'

import Styles from './Select.module.scss'

export type SelectProps = MantineSelectProps & {
    trackedBy?: string
    labelledBy?: string
    ghost?: boolean
}

export function Select(props: SelectProps) {
    const { trackedBy, labelledBy, ghost, size = 'md', data = [], ...rest } = props
    const options = useMemo(() => {
        return data.map((item: any) => {
            if (typeof item === 'string') {
                return { value: item, label: item }
            }
            const value = trackedBy ? get(item, trackedBy) : item.value
            const label = labelledBy ? get(item, labelledBy) : item.label
            return { value, label }
        })
    }, [data, trackedBy, labelledBy])
    return (
        <MantineSelect
            {...rest}
            size={size}
            data={options}
            classNames={{
                input: cn(Styles.input, ghost && Styles.ghost, Styles[size]),
                item: Styles.dropdownItem,
            }}
        />
    )
}

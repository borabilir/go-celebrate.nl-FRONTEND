import {
    Checkbox
} from '@mantine/core'
import CheckboxComponent from '@/components/form/Checkbox'
import { get } from 'lodash'

export default function CheckboxGroup({
    options = [],
    onChange = () => {},
    trackedBy,
    labelledBy,
    ...props
}) {
    const transformedOptions = options.map(option => {
        return {
            value: trackedBy ? get(option, trackedBy, option) : option,
            label: labelledBy ? get(option, labelledBy, option) : option,
        }
    })

    return (
        <>
            <Checkbox.Group
                {...props}
                onChange={onChange}
            >
                {
                    transformedOptions.map((itemProps, index) => ( <CheckboxComponent key={index} {...itemProps} /> ))
                }
            </Checkbox.Group>
        </>
    )
}
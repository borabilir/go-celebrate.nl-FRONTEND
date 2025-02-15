import { forwardRef } from 'react'
import cn from 'classnames'
import {
    Checkbox
} from '@mantine/core'

const CheckboxComponent = (props = {}, ref) => {
    return (
        <>
            <Checkbox
                ref={ref}
                {...props}
                classNames={{
                    root: 'flex items-center',
                    inner: 'w-6 h-6',
                    label: 'md:text-base text-default',
                    input: cn('block focus:border-blue-light rounded border-[1.5px] w-6 h-6', props.error ? 'border-carmin-red' : 'border-dark-blue-200', ['lg', 'xl'].includes(props.size) && 'md:text-lg')
                }}
            />
            { props.error && <div className="font-semibold text-sm text-carmin-red">{props.error}</div> }
        </>
    )
}

export default forwardRef(CheckboxComponent)
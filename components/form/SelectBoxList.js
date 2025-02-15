import cn from 'classnames'
import { forwardRef } from 'react'
import { RadioGroup } from '@headlessui/react'
import { get } from 'lodash'
import {
    FiCheck,
    FiCircle
} from 'react-icons/fi'

const SelectBoxList = ({
    options = [],
    value,
    onChange,
    labelledBy,
    trackedBy,
    name,
    required,
    className,
    label,
    error,
    dense
}, ref) => {
    if (error) {
        error = error.replace(name, label || 'This')
    }
    return (
        <div
            className={cn(className)}
        >
            <RadioGroup
                value={value}
                onChange={onChange}
                ref={ref}
            >
                {label && <RadioGroup.Label className="block mb-3 md:mb-2 md:text-base font-semibold text-default">
                    {label}
                    {required && <span className="ml-1 text-red-600">*</span>}
                </RadioGroup.Label>}
                <ul
                    className="grid lg:grid-cols-2 gap-3 md:gap-4"
                >
                    {
                        options.map((option, index) => (
                            <RadioGroup.Option
                                key={index}
                                name={name}
                                value={trackedBy ? get(option, trackedBy, option) : option}
                                className={({ checked, active }) =>
                                    cn(
                                        checked ? 'pl-3 border-transparent bg-default text-white' : 'pl-3 border-dark-blue-200',
                                        active ? 'ring-2 ring-light-blue' : '',
                                        error && 'border-red-600',
                                        dense ? 'py-2.5 md:py-2' : 'py-2 md:py-3',
                                        'flex items-center gap-3 pr-4 md:pr-6 rounded border font-bold cursor-pointer outline-none'
                                    )
                                }
                            >
                                {
                                    ({ checked, active }) => (
                                        <>
                                            {checked ? <FiCheck className="shrink-0 text-success md:w-5 md:h-5" /> : <FiCircle className="shrink-0 text-dark-blue-200 md:w-5 md:h-5" /> }
                                            <RadioGroup.Label className="cursor-pointer">{ labelledBy ? get(option, labelledBy, option) : option }</RadioGroup.Label>
                                        </>
                                    )
                                }
                            </RadioGroup.Option>
                        ))
                    }
                </ul>
            </RadioGroup>
            {error && <span className="font-semibold text-sm text-carmin-red">{error}</span>}
        </div>
    )
}

export default forwardRef(SelectBoxList)
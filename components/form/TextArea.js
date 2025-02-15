import { forwardRef } from 'react'
import cn from 'classnames'
import {
    Textarea
} from '@mantine/core'

const TextArea = ({
    name,
    label,
    description,
    disabled,
    icon,
    multiline,
    required,
    size = 'md',
    placeholder,
    className,
    onChange,
    onBlur,
    error,
    value = '',
    dense,
    denser,
    type = 'text',
    ...rest
}, ref) => {
    if (error) {
        error = error.replace(name, label || 'This')
    }
    return (
        <div
            className={className}
        >
            <Textarea
                name={name}
                label={label}
                description={description}
                disabled={disabled}
                invalid={error}
                icon={icon}
                multiline={multiline}
                required={required}
                size={size}
                placeholder={placeholder}
                className="font-sans text-base"
                classNames={{
                    label: 'md:text-base font-semibold text-default mb-1.5',
                    input: cn('focus:border-blue-light rounded', error ? 'border-carmin-red' : 'border-dark-blue-200', ['lg', 'xl'].includes(size) && 'md:text-lg', icon && 'pl-9')
                }}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                ref={ref}
                type={type}
                {...rest}
            />
            {error && <span className="font-semibold text-sm text-carmin-red">{error}</span>}
        </div>
    )
}

export default forwardRef(TextArea)
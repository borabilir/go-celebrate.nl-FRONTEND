/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/24/solid'
import cn from 'classnames'
import { get } from 'lodash'

/* const people = [
    { id: 1, name: 'Bruiloft / Trouwfeest' },
    { id: 2, name: 'Kerstfeest' },
    { id: 3, name: 'Communie' },
    { id: 4, name: 'Lentefeest' },
    { id: 5, name: 'Privé' },
    { id: 6, name: 'Bedrijfsfeest' },
    { id: 7, name: 'Publiek evenement' },
    { id: 8, name: 'Festival ' },
    { id: 9, name: 'Merkactivatie - Marketing' },
    { id: 10, name: 'Vrijgezellenfeest' },
    { id: 11, name: 'Valentijnsdag' },
]
 */
export default function Select({ options = [], labelledBy, trackedBy, label, placeholder, ghost, onChange, value }) {
    const selectedValue = trackedBy ? options.find((o) => get(o, trackedBy) === value) : value

    function handleChange(v) {
        onChange(v)
    }

    return (
        <Listbox value={value} onChange={handleChange} className="font-sans">
            {({ open }) => (
                <>
                    {label && <Listbox.Label className="block font-medium">{label}</Listbox.Label>}
                    <div className="mt-1 relative z-30">
                        <Listbox.Button
                            className={cn(
                                'bg-white relative w-full rounded-md pl-4 pr-10 pt-3 pb-4 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-dark-blue-200 focus:border-dark-blue-200',
                                !ghost && 'border border-dark-blue-200 shadow'
                            )}
                        >
                            {selectedValue ? (
                                <span className="block truncate">
                                    {labelledBy ? get(selectedValue, labelledBy) : selectedValue}
                                </span>
                            ) : (
                                <span className="block truncate opacity-50">{placeholder || 'Choose an option'}</span>
                            )}
                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </span>
                        </Listbox.Button>

                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-default ring-opacity-5 overflow-auto focus:outline-none">
                                {options &&
                                    options.map((option) => (
                                        <Listbox.Option
                                            key={trackedBy ? get(option, trackedBy) : option}
                                            className={({ active }) =>
                                                cn(
                                                    active ? 'bg-dark-blue-200' : '',
                                                    'cursor-default select-none relative py-2 pl-3 pr-9'
                                                )
                                            }
                                            value={trackedBy ? get(option, trackedBy) : option}
                                        >
                                            {({ value, active }) => (
                                                <>
                                                    <span
                                                        className={cn(
                                                            value ? 'font-semibold' : 'font-normal',
                                                            'block truncate'
                                                        )}
                                                    >
                                                        {labelledBy ? get(option, labelledBy) : option}
                                                    </span>

                                                    {value ? (
                                                        <span
                                                            className={cn(
                                                                active ? 'text-white' : 'text-dark-blue-200-600',
                                                                'absolute inset-y-0 right-0 flex items-center pr-4'
                                                            )}
                                                        >
                                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                {(!options || options.length === 0) && (
                                    <div className="px-4 py-2 text-center text-default opacity-60">No options</div>
                                )}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </>
            )}
        </Listbox>
    )
}

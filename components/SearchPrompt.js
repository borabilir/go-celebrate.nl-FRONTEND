import cn from 'classnames'
import { Fragment, useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import { Loader } from '@mantine/core'
import { useAtom } from 'jotai'

import { searchPromoptOpenAtom } from '@/context/ui'

const results = [
    { id: 1, name: 'Crepes Antwerp', url: '#' },
    { id: 2, name: 'Foodtruck example', url: '#' },
    // More people...
]

export default function SearchPrompt() {
    const [query, setQuery] = useState('')
    const [open, setOpen] = useAtom(searchPromoptOpenAtom)
    const [loading, setLoading] = useState(false)

    const filteredPeople =
        query === ''
            ? []
            : results.filter((person) => {
                  return person.name.toLowerCase().includes(query.toLowerCase())
              })
    return (
        <Transition.Root show={open} as={Fragment} afterLeave={() => setQuery('')} appear>
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-dark-blue bg-opacity-40 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="mx-auto max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-smooth ring ring-dark-blue ring-opacity-5 transition-all">
                            <Combobox>
                                <div className="relative">
                                    {loading ? (
                                        <Loader
                                            color="gray"
                                            className="absolute top-1/2 -translate-y-1/2 left-4 md:left-5 h-5 w-5 md:h-6 md:w-6 text-gray-400"
                                        />
                                    ) : (
                                        <BiSearch
                                            className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-4 md:left-5 h-5 w-5 md:h-6 md:w-6 text-gray-400"
                                            aria-hidden="true"
                                        />
                                    )}
                                    <Combobox.Input
                                        className="h-12 w-full border-0 bg-transparent pl-11 md:pl-14 pr-4 md:pr-6 py-6 md:py-8 text-gray-900 placeholder:text-gray-400 focus:ring-0 text-sm md:text-base"
                                        placeholder="Search..."
                                        onChange={(event) => setQuery(event.target.value)}
                                    />
                                </div>

                                {filteredPeople.length > 0 && (
                                    <Combobox.Options
                                        static
                                        className="max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-800"
                                    >
                                        {filteredPeople.map((person) => (
                                            <Combobox.Option
                                                key={person.id}
                                                value={person}
                                                className={({ active }) =>
                                                    cn(
                                                        'cursor-default select-none px-4 py-2',
                                                        active && 'bg-indigo-600 text-white'
                                                    )
                                                }
                                            >
                                                {person.name}
                                            </Combobox.Option>
                                        ))}
                                    </Combobox.Options>
                                )}

                                {query !== '' && filteredPeople.length === 0 && (
                                    <p className="p-4 text-sm text-gray-500">No results found.</p>
                                )}
                            </Combobox>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

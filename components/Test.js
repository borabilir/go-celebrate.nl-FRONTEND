import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'

export default function Test() {
    return (
        <div>
            <Popover className="relative">
                {
                    ({ open }) => (
                        <>
                            <Popover.Button
                                className={`
                                ${open ? '' : 'text-opacity-90'}
                                text-white group bg-orange-700 px-3 py-2 rounded-md inline-flex items-center text-base font-medium hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                            >
                                <span>Solutions</span>
                            </Popover.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                            >
                                <Popover.Panel className="absolute z-10 w-screen max-w-sm px-4 mt-3 transform -translate-x-1/2 left-1/2 sm:px-0 lg:max-w-3xl">
                                    <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                        <div className="relative grid gap-8 bg-white p-7 lg:grid-cols-2">
                                            Boooooo
                                        </div>
                                    </div>
                                </Popover.Panel>
                            </Transition>
                        </>
                    )
                }
            </Popover>
        </div>
    )
}
import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import cn from 'classnames'

export default function DialogComponent({ open, setOpen, full, children, className }) {
    return (
        <>
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setOpen}>
                    <div
                        className={cn(
                            'flex justify-center min-h-screen max-h-screen px-4 text-center',
                            full ? 'items-stretch' : 'pt-4 pb-16 items-end sm:items-center'
                        )}
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-default bg-opacity-50 transition-opacity" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        {/* <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                            &#8203;
                        </span> */}
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div
                                className={cn(
                                    'relative inline-flex flex-col bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:align-middle',
                                    full ? 'w-full my-4' : 'sm:max-w-sm sm:w-full sm:p-6 sm:my-8'
                                )}
                            >
                                <button
                                    className="absolute top-3 right-3 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 bg-white hover:bg-dark-blue-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-dark-blue-200 z-20"
                                    onClick={() => setOpen(false)}
                                >
                                    <span className="sr-only">Close menu</span>
                                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                </button>
                                <div className={cn('flex-grow overflow-y-scroll', className)}>{children}</div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    )
}

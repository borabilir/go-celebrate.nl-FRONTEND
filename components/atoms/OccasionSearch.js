'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import cn from 'classnames'
import { FiSearch } from 'react-icons/fi'

export default function OccasionSearch({ searchLabel = "What's the occasion?", className }) {
    const { pathname } = useRouter()
    return (
        <>
            <Link
                href={`/get-quote?_r=${pathname || ''}`}
                tabIndex="1"
                className={cn(
                    className,
                    'relative sm:max-w-xs flex items-center justify-between p-1.5 pl-6 rounded-full bg-white shadow-md cursor-pointer font-bold focus:outline-none focus:ring focus:ring-default focus:ring-opacity-20'
                )}
            >
                <span>{searchLabel}</span>
                <div className="p-2.5 bg-carmin-red rounded-full">
                    <FiSearch className="w-6 h-6 text-white" />
                </div>
            </Link>
        </>
    )
}

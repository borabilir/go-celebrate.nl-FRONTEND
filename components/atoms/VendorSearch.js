import Link from 'next/link'
import Image from 'next/image'

import { FiArrowRight, FiMoreHorizontal } from 'react-icons/fi'

export default function VendorSearch() {
    return (
        <div
            /* htmlFor="home-page-search" */
            className="space-y-3"
        >
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                <Link
                    href="/foodtrucks"
                    className="flex items-center gap-2 pl-3 pr-4 py-2 text-xs text-gray-500 bg-white shadow-level-2 rounded"
                >
                    <Image alt="Foodtrucks" src="/images/icons/foodtruck-24.svg" width={24} height={24} />
                    Foodtrucks
                </Link>
                <button className="flex items-center gap-2 pl-3 pr-4 py-2 text-xs text-gray-500 bg-white shadow-level-2 rounded">
                    <Image alt="Catering" src="/images/icons/catering-24.svg" width={24} height={24} />
                    Catering
                </button>
                <button className="flex items-center gap-2 pl-3 pr-4 py-2 text-xs text-gray-500 bg-white shadow-level-2 rounded">
                    <Image alt="Drinks" src="/images/icons/drinks-24.svg" width={24} height={24} />
                    Drinks
                </button>
                <button className="flex items-center gap-2 pl-4 pr-3 py-2 text-xs text-gray-500 bg-white shadow-level-2 rounded">
                    Meer
                    <FiMoreHorizontal size="24px" />
                </button>
            </div>
            <Link
                href="/book"
                className="inline-flex items-center gap-2 bg-carmin-red mx-auto lg:mx-0 px-4 py-3 font-medium text-white text-sm rounded-sm"
            >
                <span>Start een aanvraag</span>
                <FiArrowRight size="24px" className="ml-4" />
            </Link>
            {/* <input
                id="home-page-search"
                type="text"
                className="grow border-none focus:ring-0 placeholder:text-dark-blue placeholder:text-opacity-60 peer"
                placeholder="Ik ben op zoek naar..."
            /> */}
        </div>
    )
}

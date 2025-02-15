import cn from 'classnames'
import { useAtom } from 'jotai'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

import { searchPromoptOpenAtom } from '@/context/ui'

export default function SearchButton({ className }) {
    const [open, setOpen] = useAtom(searchPromoptOpenAtom)
    function handleOpen() {
        console.log('handleOpen', open)
        setOpen(!open)
    }
    return (
        <button className={cn('p-1', className)} onClick={() => handleOpen()}>
            <MagnifyingGlassIcon className="w-5 h-5 shrink-0 stroke-2" />
        </button>
    )
}

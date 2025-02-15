import cn from 'classnames'
import { ReactNode } from 'react'
export default function Container({ children, className }: { children: ReactNode; className?: string }) {
    return <div className={cn('max-w-6xl mx-auto', className)}>{children}</div>
}

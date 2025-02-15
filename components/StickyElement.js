import cn from 'classnames'
import { useState, useEffect, useRef } from 'react'

export default function StickElement({
    children,
    position = 'top',
    className,
}) {
    const el = useRef()
    const [sticking, setSticking] = useState()
    useEffect(() => {
        const observer = new IntersectionObserver( 
            ([e]) => {
                const {
                    intersectionRect,
                    intersectionRatio,
                    rootBounds
                } = e
                setSticking(
                    (intersectionRatio < 1) &&
                    (intersectionRect[position] === rootBounds[position]) // Only stick if the element is at the desired position (top or bottom)
                )
            },
            { threshold: [1] }
        )
        observer.observe(el.current)
        return () => {
            if (observer) {
                observer.disconnect()
            }
        }
    }, [])
    return (
        <div
            ref={el}
            className={cn(
                'sticky z-10 transition-shadow duration-100',
                position === 'top' && '-top-px',
                position === 'bottom' && '-bottom-px',
                (sticking && position === 'top') && 'shadow-sticking',
                (sticking && position === 'bottom') && 'shadow-stickingReverse',
                className
            )}
        >
            { typeof children === 'function' ? children(sticking) : children }
        </div>
    )
}
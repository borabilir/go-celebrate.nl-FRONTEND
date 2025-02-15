import ReactMarkdown from 'react-markdown'
import cn from 'classnames'
export default function Markdown({
    children,
    className
}) {
    return <ReactMarkdown
        className={cn('rich-text', className)}
        components={{
            h1: ({ node, ...props }) => <h1 className="heading-1" {...props}></h1>,
            h2: ({ node, ...props }) => <h2 className="heading-2" {...props}></h2>,
            h3: ({ node, ...props }) => <h3 className="heading-3" {...props}></h3>,
            h4: ({ node, ...props }) => <h4 className="heading-4" {...props}></h4>,
            /* p: ({ node, ...props }) => <p className="mb-8" {...props}></p> */
        }}
    >
        {children}
    </ReactMarkdown>
}
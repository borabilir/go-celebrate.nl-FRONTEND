import ReactMarkdown from 'react-markdown'

export default function FormattedMarkdown({ children }) {
    return (
        <>
            <ReactMarkdown
                components={{
                    h2: ({ node, ...props }) => <h2 className="font-size-sm" {...props}></h2>
                }}
            >
                {children}
            </ReactMarkdown>
        </>
    )
}
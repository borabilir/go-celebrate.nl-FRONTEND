/* import dynamic from 'next/dynamic'

export default dynamic(() => import('@mantine/rte'), {
    // Disable during server side rendering
    ssr: false,
    // Render anything as fallback on server, e.g. loader or html content without editor
    loading: ctx => <div className='p-6 bg-gray-200 rounded-sm animate-pulse' />,
}) */

export default function RichTextEditor({ value, onChange }) {
    return (
        <textarea
            className="w-full h-32 px-3 py-2 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline"
            placeholder="Enter some long form content."
            value={value}
            onChange={onChange}
        />
    )
}

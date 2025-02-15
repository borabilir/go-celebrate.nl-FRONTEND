import cn from 'classnames'
// @ts-ignore
import sanitizeHtml from 'sanitize-html'

const defaultOptions = {
    allowedIframeHostnames: ['www.youtube.com'],
    allowedClasses: {
        h2: [/^heading/],
        h3: [/^heading/],
        h4: [/^heading/],
        h5: [/^heading/],
        h6: [/^heading/],
        p: ['lead'],
        ul: ['list-disc', 'pl-4', 'space-y-1.5', 'marker:text-dark-blue-300'],
    },
    transformTags: {
        h2: sanitizeHtml.simpleTransform('h2', { class: 'heading-2' }),
        h3: sanitizeHtml.simpleTransform('h3', { class: 'heading-3' }),
        ul: sanitizeHtml.simpleTransform('ul', { class: 'list-disc pl-4 space-y-1.5 marker:text-dark-blue-300' }),
    },
}

const sanitize = (dirty: string, options: any) => ({
    __html: sanitizeHtml(dirty, { ...defaultOptions, ...options }),
})

export default function SanitizeHTML({ children: html = '', options = {}, className }: any) {
    return <div className={cn('rich-text', className)} dangerouslySetInnerHTML={sanitize(html, options)} />
}

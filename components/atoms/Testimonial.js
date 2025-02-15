import BlockImage from '@/components/helpers/BlockImage'

export default function Testimonial({
    blok,
    list
}) {
    const Component = list ? 'li' : 'div' // Wether it is in text or in a Testimonials component
    const {
        text,
        name,
        company,
        position,
        companyLogo
    } = blok
    return (
        <Component className="relative">
            <div className="relative">
                <svg className="absolute -top-3 -left-6" id="quote-mark" width="41" height="30" xmlns="http://www.w3.org/2000/svg">
                    <path className="fill-current opacity-50" d="M9.878 29.494c2.501 0 4.6-.871 6.298-2.613 1.697-1.742 2.546-3.819 2.546-6.231 0-1.876-.536-3.596-1.608-5.159a8.465 8.465 0 0 0-4.288-3.283c.447-3.305 2.01-6.655 4.69-10.05L9.476.684a56.255 56.255 0 0 0-2.881 3.819A38.111 38.111 0 0 0 3.781 9.26a32.64 32.64 0 0 0-2.077 5.226C1.168 16.273.9 18.015.9 19.712c0 3.216.871 5.65 2.613 7.303 1.742 1.653 3.864 2.479 6.365 2.479Zm22.244 0c2.501 0 4.6-.871 6.298-2.613 1.697-1.742 2.546-3.819 2.546-6.231 0-1.876-.536-3.596-1.608-5.159a8.465 8.465 0 0 0-4.288-3.283c.447-3.305 2.01-6.655 4.69-10.05L31.72.684a56.255 56.255 0 0 0-2.881 3.819 38.111 38.111 0 0 0-2.814 4.757 32.64 32.64 0 0 0-2.077 5.226c-.536 1.787-.804 3.529-.804 5.226 0 3.216.871 5.65 2.613 7.303 1.742 1.653 3.864 2.479 6.365 2.479Z"/>
                </svg>
                <p className="text-lg md:text-2xl font-medium">{ text }</p>
                <svg className="absolute -bottom-3 -right-6 rotate-180" id="quote-mark" width="41" height="30" xmlns="http://www.w3.org/2000/svg">
                    <path className="fill-current opacity-50" d="M9.878 29.494c2.501 0 4.6-.871 6.298-2.613 1.697-1.742 2.546-3.819 2.546-6.231 0-1.876-.536-3.596-1.608-5.159a8.465 8.465 0 0 0-4.288-3.283c.447-3.305 2.01-6.655 4.69-10.05L9.476.684a56.255 56.255 0 0 0-2.881 3.819A38.111 38.111 0 0 0 3.781 9.26a32.64 32.64 0 0 0-2.077 5.226C1.168 16.273.9 18.015.9 19.712c0 3.216.871 5.65 2.613 7.303 1.742 1.653 3.864 2.479 6.365 2.479Zm22.244 0c2.501 0 4.6-.871 6.298-2.613 1.697-1.742 2.546-3.819 2.546-6.231 0-1.876-.536-3.596-1.608-5.159a8.465 8.465 0 0 0-4.288-3.283c.447-3.305 2.01-6.655 4.69-10.05L31.72.684a56.255 56.255 0 0 0-2.881 3.819 38.111 38.111 0 0 0-2.814 4.757 32.64 32.64 0 0 0-2.077 5.226c-.536 1.787-.804 3.529-.804 5.226 0 3.216.871 5.65 2.613 7.303 1.742 1.653 3.864 2.479 6.365 2.479Z"/>
                </svg>
            </div>
            {
                (name || position || company || (companyLogo && companyLogo.filename) ) && <div className="flex items-start mt-4">
                    { (companyLogo && companyLogo.filename) && (
                        <div className="relative shrink-0 w-12 h-12 mr-3 rounded-full bg-white overflow-hidden">
                            <BlockImage
                                image={companyLogo}
                                layout="fill"
                                className="object-contain"
                            />
                        </div>
                    ) }
                    <div
                        className={(companyLogo && companyLogo.filename) && 'pt-2'}
                    >
                        <div>
                            { name }
                            { (name && position) && <span>, </span>}
                            { position }
                        </div>
                        {company && <div className="text-sm">
                            { company }
                        </div>}
                    </div>
                </div>
            }
        </Component>
    )
}
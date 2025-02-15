import cn from 'classnames'
export default function OfferingAttribute({
    id,
    value,
    valueIndex,
    attributeDefinitions: { data: attributeDefinitions },
    attributeType: { data: attributeType },
    last,
}) {
    if (!value) return <></>
    function resolveDefinitionTextFromKey(key) {
        if (!key || !attributeDefinitions) return ''
        const found = attributeDefinitions.find((def) => def.attributes.key === key)
        if (found) return found.attributes.name
        return key
    }
    return (
        <div className={cn('py-4', !last && 'first:border-t border-b border-b-gray-200')}>
            {attributeType && (
                <h2 className="mb-3 text-lg text-gray-400 font-semibold">{attributeType.attributes.name}</h2>
            )}
            {attributeType && attributeType.attributes.valueType === 'multipleOption' ? (
                <div className="flex flex-wrap gap-2">
                    {value &&
                        value.split(',').map((val, index) => (
                            <div key={index} className="font-medium">
                                {resolveDefinitionTextFromKey(val)}
                                {index < value.split(',').length - 1 && (
                                    <span className="ml-2 text-sm text-gray-200">⦁</span>
                                )}
                            </div>
                        ))}
                </div>
            ) : (
                <div className="font-bold">{resolveDefinitionTextFromKey(value)}</div>
            )}
        </div>
    )
}

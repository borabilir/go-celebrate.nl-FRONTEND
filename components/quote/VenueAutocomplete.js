import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService"
import { Autocomplete } from '@mantine/core'
import cn from 'classnames'

import { FiMapPin } from 'react-icons/fi'
import { CgSpinner } from 'react-icons/cg'

export default function VenueAutocomplete({
    onChange,
    value,
    onSearchChange,
    searchValue,
    placeholder,
    className,
    label
}) {
    const {
        placesService,
        placePredictions,
        getPlacePredictions,
        isPlacePredictionsLoading,
    } = usePlacesService({
        apiKey: 'AIzaSyDTVEJEAOtALoA5m7EjghIbDA0Nptg0cIE',
        debounce: 1000
    })
    /* useEffect(() => {
      // fetch place details for the first element in placePredictions array
      if (placePredictions.length)
        placesService?.getDetails(
          {
            placeId: placePredictions[0].place_id,
          },
          (placeDetails) => savePlaceDetailsToState(placeDetails)
        );
    }, [placePredictions]) */
    return (
        <Autocomplete
            label={label}
            onChange={(val) => {
                getPlacePredictions({ input: val })
                onSearchChange(val)
            }}
            onItemSubmit={(val) => onChange(val && val.value)}
            value={searchValue}
            data={placePredictions.map(p => {
                return p.description
            })}
            className={cn(
                'font-sans text-base',
                className
            )}
            classNames={{
                label: 'md:text-base font-semibold',
                input: cn('md:text-lg placeholder-shown:text-base md:p-6 md:pl-8 focus:border-blue-light')
            }}
            icon={isPlacePredictionsLoading ? <CgSpinner className="animate-spin text-default w-5 h-5" /> : <FiMapPin />}
            placeholder={placeholder}
        />
    )
}
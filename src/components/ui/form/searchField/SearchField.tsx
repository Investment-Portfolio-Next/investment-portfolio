import type { UseFormRegisterReturn } from 'react-hook-form'
import type { AssetType, FieldVariant } from '@/types/commonTypes'
import { useState } from 'react'
import type { InputHTMLAttributes } from 'react'
import { variantStyles } from '@/constants/borderVariants.constants'
import { X } from 'lucide-react'
import { LoaderCircle } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import type { SearchResult } from '@/services/transactionApi/transaction.types'
import { useAssetSearch } from '@/services/transactionApi/useAssetSearch'
import { useAsset } from '@/store/useAsset'

interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'onSelect'> {
    label: string
    registration: UseFormRegisterReturn
    variant?: FieldVariant
    assetType: AssetType
    resetForm: () => void
}

export function SearchField({
    label,
    registration,
    variant = 'primary',
    assetType,
    resetForm,

    ...inputProps
}: SearchFieldProps) {
    const styles = variantStyles[variant]

    const [searchString, setSearchString] = useState<string>('')
    const [showResults, setShowResults] = useState<boolean>(false)
    const [hasUserSelected, setHasUserSelected] = useState<boolean>(false)

    const debouncedSearchString = useDebounce(searchString, 1000)

    const { setAsset, clearAsset } = useAsset()

    const {
        data: searchResults,
        error,
        isLoading,
        isFetching,
    } = useAssetSearch(!hasUserSelected && debouncedSearchString.trim() !== '' ? debouncedSearchString : '', assetType)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchString(value)
        setHasUserSelected(false)
        clearAsset()
        setShowResults(true)
        resetForm()
        registration.onChange(e) // Update form registration value
    }

    const handleResultSelect = (result: SearchResult) => {
        const selectedValue = result.symbol
        setHasUserSelected(true)
        setSearchString(`${result.symbol} - ${result.name}`)
        setAsset(result)
        setShowResults(false)

        // Update the form registration
        registration.onChange({
            target: { value: selectedValue, name: registration.name },
        } as React.ChangeEvent<HTMLInputElement>)
    }

    const handleClearInput = () => {
        setSearchString('')
        clearAsset()
        resetForm()
        setShowResults(false)

        // Clear the form registration
        registration.onChange({
            target: { value: '', name: registration.name },
        } as React.ChangeEvent<HTMLInputElement>)
    }

    const handleInputBlur = () => {
        setTimeout(() => setShowResults(false), 500)
    }

    const handleInputFocus = () => {
        if (!hasUserSelected && searchResults && searchResults.length > 0) {
            setShowResults(true)
        }
    }

    return (
        <div className="relative">
            <label>
                <span className="input-label">{label}</span>
                <div className="relative">
                    <input
                        {...inputProps}
                        className={`h-9 input-basic ${error ? 'border-error focus:border-error' : styles}`}
                        {...registration}
                        value={searchString}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        autoComplete="off"
                        placeholder={`Search for ${assetType}...`}
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                        {searchString && !isLoading && !isFetching && (
                            <button
                                type="button"
                                onClick={handleClearInput}
                                className="text-white/80 hover:text-primary "
                                aria-label="Clear search field"
                            >
                                <X size={16} />
                            </button>
                        )}
                        {(isLoading || isFetching) && (
                            <LoaderCircle className="animate-spin h-4 w-4 text-primaryDark" />
                        )}
                    </div>
                </div>
            </label>

            {showResults && searchResults && searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-searchBg border border-primaryLight rounded-md max-h-80 overflow-y-auto">
                    {searchResults.map((result, index) => (
                        <div
                            key={`${result.symbol}-${index}`}
                            className="px-4 py-2 hover:bg-bg cursor-pointer border-b border-primaryLight last:border-b-0"
                            onMouseDown={(e) => e.preventDefault()} // Prevent input blur
                            onClick={() => handleResultSelect(result)}
                        >
                            <div className="font-medium text-sm text-white/90">{result.symbol}</div>
                            {result.type && <div className="text-xs text-white/30 ">{result.type}</div>}
                            <div className="text-xs text-white/70 truncate">{result.name}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Error Message */}
            <p className="text-error text-xs mt-1 min-h-[1.125rem]">{error ? error.message : '\u00A0'}</p>
        </div>
    )
}

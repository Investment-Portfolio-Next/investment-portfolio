import type { UseFormRegisterReturn, UseFormSetValue, PathValue, Path } from 'react-hook-form'
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
import type { ITransactionForm } from '@/components/ModalTransactions/TransactionForm/transactionForm.types'

interface SearchFieldProps<TFieldName extends keyof ITransactionForm>
    extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'onSelect'> {
    label: string
    registration: UseFormRegisterReturn<TFieldName>
    variant?: FieldVariant
    assetType: AssetType
    resetForm: () => void
    resetFieldsForSearch: () => void
    errors?: string
    hasErrors?: boolean
    setValue: UseFormSetValue<ITransactionForm>
}

export function SearchField<TFieldName extends keyof ITransactionForm>({
    label,
    registration,
    variant = 'primary',
    assetType,
    resetForm,
    resetFieldsForSearch,
    errors,
    hasErrors,
    setValue,
    ...inputProps
}: SearchFieldProps<TFieldName>) {
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
    } = useAssetSearch(
        hasErrors || hasUserSelected || debouncedSearchString.trim() === '' ? '' : debouncedSearchString,
        assetType,
    )

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value

        setSearchString(value)
        setHasUserSelected(false)
        clearAsset()
        setShowResults(true)
        resetFieldsForSearch()

        setValue(
            registration.name as Path<ITransactionForm>,
            { symbol: value, name: '' } as PathValue<ITransactionForm, TFieldName>,
            {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
            },
        )
    }

    const handleResultSelect = (result: SearchResult) => {
        setHasUserSelected(true)
        setAsset(result)
        setShowResults(false)

        setValue(
            registration.name as Path<ITransactionForm>,
            { symbol: result.symbol, name: result.name } as PathValue<ITransactionForm, TFieldName>,
            {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
            },
        )

        setSearchString(`${result.symbol} - ${result.name}`)
    }

    const handleClearInput = () => {
        setSearchString('')
        clearAsset()
        setShowResults(false)

        setValue(
            registration.name as Path<ITransactionForm>,
            { symbol: '', name: '' } as PathValue<ITransactionForm, TFieldName>,
            {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
            },
        )
        resetForm()
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
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlurCapture={handleInputBlur}
                        value={searchString}
                        autoComplete="off"
                        placeholder={`Search for ${assetType}...`}
                    />
                    <div className="absolute inset-y-0 right-2 flex items-center justify-center">
                        {searchString && !isLoading && !isFetching && (
                            <button
                                type="button"
                                onClick={handleClearInput}
                                className="text-white/80 hover:text-primary"
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

            <p className="text-error text-xs mt-1 min-h-[1.125rem]">
                {error ? error.message : errors ? errors : '\u00A0'}
            </p>
        </div>
    )
}

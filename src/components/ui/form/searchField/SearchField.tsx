import type { UseFormSetValue, PathValue, Path, Control, RegisterOptions } from 'react-hook-form'
import { useController } from 'react-hook-form'
import type { AssetType, FieldVariant } from '@/types/commonTypes.types'
import { useState } from 'react'
import { variantStyles } from '@/constants/borderVariants.constants'
import { X } from 'lucide-react'
import { LoaderCircle } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import type { ISearchResult } from '@/api/public/public.types'
import { useAssetSearch } from '@/services/publicQueries/query-hooks/useAssetSearch'
import { useAsset } from '@/store/useAsset'
import type { ITransactionForm } from '@/components/ModalTransactions/TransactionForm/transactionForm.types'

interface SearchFieldProps<TFieldName extends Path<ITransactionForm>> extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'value' | 'onSelect'
> {
    control: Control<ITransactionForm>
    name: TFieldName
    rules?: RegisterOptions<ITransactionForm, TFieldName>
    setValue: UseFormSetValue<ITransactionForm>
    label: string
    variant?: FieldVariant
    assetType: AssetType
    resetForm: () => void
    resetFieldsForSearch: () => void
}

export const SearchField = <TFieldName extends Path<ITransactionForm>>({
    label,
    control,
    name,
    rules,
    variant = 'primary',
    assetType,
    resetForm,
    resetFieldsForSearch,
    setValue,
    ...inputProps
}: SearchFieldProps<TFieldName>) => {
    const styles = variantStyles[variant]

    const [searchString, setSearchString] = useState<string>('')
    const [showResults, setShowResults] = useState<boolean>(false)
    const [hasUserSelected, setHasUserSelected] = useState<boolean>(false)

    const debouncedSearchString = useDebounce(searchString, 1000)

    const { setAsset, clearAsset } = useAsset()

    const {
        field,
        fieldState: { error: fieldErrors },
        formState: {},
    } = useController({ control, name, rules })

    const hasErrors = !!fieldErrors

    const {
        data: searchResults,
        error: searchErrors,
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
            name as Path<ITransactionForm>,
            { symbol: value, name: '' } as PathValue<ITransactionForm, TFieldName>,
            {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
            },
        )
    }

    const handleResultSelect = (result: ISearchResult) => {
        setHasUserSelected(true)
        setAsset(result)
        setShowResults(false)

        setValue(
            name as Path<ITransactionForm>,
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

        setValue(name as Path<ITransactionForm>, { symbol: '', name: '' } as PathValue<ITransactionForm, TFieldName>, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        })

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
                        name={name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlurCapture={handleInputBlur}
                        value={searchString}
                        autoComplete="off"
                        placeholder={`Search for ${assetType}...`}
                        className={`h-9 input-basic ${
                            searchErrors || fieldErrors ? 'border-error focus:border-error' : styles
                        }`}
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
                            {result.assetType && <div className="text-xs text-white/30 ">{result.assetType}</div>}
                            <div className="text-xs text-white/70 truncate">{result.name}</div>
                        </div>
                    ))}
                </div>
            )}

            <p className="text-error text-xs mt-1 min-h-[1.125rem]">
                {searchErrors ? searchErrors.message : fieldErrors ? fieldErrors.message : ' '}
            </p>
        </div>
    )
}

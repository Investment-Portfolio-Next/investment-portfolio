'use client'
import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Field } from '@/components/ui/form/field/Field'
import { SelectField } from '@/components/ui/form/selectField/SelectField'
import { TextareaField } from '@/components/ui/form/textareaField/TextareaField'
import { Checkbox } from '@/components/ui/form/checkbox/Checkbox'
import { formatDateToInput } from '@/utils/helper'
import { Button } from '@/components/ui/button/Button'
import type { SubmitHandler } from 'react-hook-form'
import type { AssetType } from '@/types/commonTypes'
import type { ITransactionForm } from './transactionForm.types'
import { transactionTypeOptions, transactionCurrencyOptions } from './transactionsOptions.data'
import { getValidationRules } from './validations'
import { TransactionTotalSum } from './TransactionTotalSum/TransactionTotalSum'
import { SearchField } from '@/ui/form/searchField/SearchField'
import { useAsset } from '@/store/useAsset'
import { DateField } from '@/ui/form/dateField/DateField'

interface TransactionsFormProps {
    assetType: AssetType
    onClose: () => void
}

export function TransactionsForm({ assetType, onClose }: TransactionsFormProps) {
    const { asset, isLoadingPrice, priceError, setNewDate, clearPriceError, setManualPrice } = useAsset()

    const accountOpenDate = new Date('2020-01-01') //TODO: set real data later: date of account creation
    const assetQuantityLimit = 1000 // TODO: check if the limit is necessary
    const isBond = assetType === 'bond'

    const validations = getValidationRules({
        accountOpenDate,
        assetQuantityLimit, // TODO: check if the limit is necessary
        isBond,
    })
    const defaultValues: ITransactionForm = {
        symbolID: { symbol: '', name: '' },
        transactionType: 'buy',
        transactionCurrency: 'USD',
        transactionDate: formatDateToInput(new Date()),
        initialPrice: null,
        transactionCommision: null,
        transactionQuantity: null,
        bondNominal: null,
        bondAccruedInterest: null,
        isAccruedInterestPerBond: true,
        notes: '',
    }

    const {
        register,
        unregister,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
        reset,
        resetField,
        control,
        setValue,
    } = useForm<ITransactionForm>({
        mode: 'onChange',
        defaultValues,
    })

    const typeOfTransaction = useWatch({ control, name: 'transactionType' })
    const currency = useWatch({ control, name: 'transactionCurrency' })
    const price = useWatch({ control, name: 'initialPrice' })
    const quantity = useWatch({ control, name: 'transactionQuantity' })
    // const dateOfTransaction = useWatch({ control, name: 'transactionDate' })
    const commission = useWatch({ control, name: 'transactionCommision' })
    const bondNominal = useWatch({ control, name: 'bondNominal' })
    const accruedInterest = useWatch({ control, name: 'bondAccruedInterest' })
    const accruedPerBond = useWatch({ control, name: 'isAccruedInterestPerBond' })

    useEffect(() => {
        if (asset?.price !== null && asset?.price !== undefined) {
            setValue('initialPrice', asset.price)
        } else if (asset && asset.price === null) {
            setValue('initialPrice', null)
        }
    }, [asset?.price, setValue, asset])

    const handleClearValue = (fieldNames: keyof ITransactionForm | (keyof ITransactionForm)[]): void => {
        const names = Array.isArray(fieldNames) ? fieldNames : [fieldNames]
        names.forEach((fieldName) => {
            resetField(fieldName)
            if (fieldName === 'initialPrice') clearPriceError()
        })
    }

    const resetFieldsForSearch = (): void => {
        handleClearValue([
            'transactionType',
            'transactionQuantity',
            'transactionDate',
            'initialPrice',
            'transactionCommision',
            'transactionCurrency',
            'notes',
            ...(isBond ? (['bondNominal', 'bondAccruedInterest', 'isAccruedInterestPerBond'] as const) : []),
        ])
    }

    const handlePriceChange = (e: { target: { value: number | null; name: string } }) => {
        const newPrice = e.target.value ? e.target.value : null

        if (asset && !isLoadingPrice) {
            setManualPrice(newPrice)
            clearPriceError()
        }
    }

    useEffect(() => {
        if (!isBond) {
            unregister(['bondNominal', 'bondAccruedInterest', 'isAccruedInterestPerBond'])
        }
    }, [unregister, isBond])

    const onSubmit: SubmitHandler<ITransactionForm> = async (data) => {
        const provider = asset?.provider
        const submissionData = {
            ...data,
            symbolID: data.symbolID.symbol,
            assetType,
            provider,
        }

        await new Promise((resolve) => setTimeout(resolve, 1000))

        console.log(submissionData)
        reset()
        onClose()
    }

    return (
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <SearchField
                label="Asset ID"
                type="text"
                registration={register('symbolID', validations.symbolID)}
                assetType={assetType}
                resetForm={reset}
                errors={errors.symbolID?.message}
                hasErrors={!!errors.symbolID}
                resetFieldsForSearch={resetFieldsForSearch}
                setValue={setValue}
            />
            <div className="grid grid-cols-3 gap-4">
                <SelectField
                    label="Transaction"
                    registration={register('transactionType')}
                    options={transactionTypeOptions}
                />
                <Field
                    label="Quantity"
                    type="number"
                    step="any"
                    registration={register('transactionQuantity', validations.transactionQuantity)}
                    errors={errors.transactionQuantity?.message}
                    fieldValue={quantity}
                    handleClearValue={handleClearValue}
                    setValue={setValue}
                />
                <DateField
                    label="Date"
                    type="date"
                    registration={{
                        ...register('transactionDate', validations.transactionDate),
                        onChange: async (e) => {
                            await register('transactionDate').onChange(e)
                            setNewDate(e.target.value)
                        },
                    }}
                    errors={errors.transactionDate?.message}
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <Field
                    label="Price"
                    type="number"
                    step="any"
                    registration={{
                        ...register('initialPrice', validations.initialPrice),
                        onChange: async (e) => {
                            await register('initialPrice').onChange(e)
                            handlePriceChange(e)
                        },
                    }}
                    errors={errors.initialPrice?.message || (priceError ?? '')}
                    isLoadingPrice={isLoadingPrice}
                    fieldValue={price}
                    handleClearValue={handleClearValue}
                    setValue={setValue}
                />
                <Field
                    label="Commission"
                    type="number"
                    step="any"
                    registration={register('transactionCommision', validations.transactionCommision)}
                    errors={errors.transactionCommision?.message}
                    fieldValue={commission}
                    handleClearValue={handleClearValue}
                    setValue={setValue}
                />
                <SelectField
                    label="Currency"
                    registration={register('transactionCurrency')}
                    options={transactionCurrencyOptions}
                />
            </div>

            {isBond && (
                <div className="grid grid-cols-3 gap-4">
                    <Field
                        label="Bond Nominal"
                        type="number"
                        step="any"
                        registration={register('bondNominal', validations.bondNominal)}
                        errors={errors.bondNominal?.message}
                        fieldValue={bondNominal}
                        handleClearValue={handleClearValue}
                        setValue={setValue}
                    />
                    <Field
                        label="Accrued Interest (AI)"
                        type="number"
                        step="any"
                        registration={register('bondAccruedInterest', validations.bondAccruedInterest)}
                        errors={errors.bondAccruedInterest?.message}
                        fieldValue={accruedInterest}
                        handleClearValue={handleClearValue}
                        setValue={setValue}
                    />
                    <div className="flex pb-3 w-full h-full justify-start items-end">
                        <Checkbox label="AI per Bond" registration={register('isAccruedInterestPerBond')} />
                    </div>
                </div>
            )}

            <TextareaField
                label="Notes"
                registration={register('notes', validations.notes)}
                errors={errors.notes?.message}
                placeholder="You can add a comment for a transaction (optional)"
            />

            <div className="flex justify-between mt-2">
                <TransactionTotalSum
                    currency={currency}
                    price={price}
                    quantity={quantity}
                    commission={commission}
                    isBond={isBond}
                    accruedInterest={accruedInterest}
                    accruedPerBond={accruedPerBond}
                    typeOfTransaction={typeOfTransaction}
                />
                <div className="flex gap-3">
                    <Button type="button" onClick={onClose} variant="primaryTransparent">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={!isValid} isSubmitting={isSubmitting}>
                        Save Transaction
                    </Button>
                </div>
            </div>
        </form>
    )
}

'use client'

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

interface TransactionsFormProps {
    assetType: AssetType
    onClose: () => void
}

export function TransactionsForm({ assetType, onClose }: TransactionsFormProps) {
    const today = formatDateToInput(new Date())

    // TODO: заменить временные значения на реальные
    const accountOpenDate = new Date('2020-01-01') //дата открытия счета
    const assetQuantityLimit = 1000 // кол-во конкретного ассета - после сабмита с бека
    const isBond = assetType === 'bond'

    const validations = getValidationRules({
        accountOpenDate,
        assetQuantityLimit,
        isBond,
    })

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm<ITransactionForm>({
        mode: 'onChange',
        defaultValues: {
            transactionType: 'buy',
            transactionCurrency: 'USD',
            transactionDate: today,
            initialPrice: 0,
            transactionCommision: 0,
            transactionQuantity: 1,
            bondNominal: 0,
            bondAccruedInterest: 0,
            isAccruedInterestPerBond: true,
        },
    })

    const typeOfTransaction = useWatch({ control, name: 'transactionType' })
    const currency = useWatch({ control, name: 'transactionCurrency' })
    const price = useWatch({ control, name: 'initialPrice' })
    const quantity = useWatch({ control, name: 'transactionQuantity' })
    const commission = useWatch({ control, name: 'transactionCommision' })
    const accruedInterest = useWatch({ control, name: 'bondAccruedInterest' })
    const accruedPerBond = useWatch({ control, name: 'isAccruedInterestPerBond' })

    const onSubmit: SubmitHandler<ITransactionForm> = (data) => {
        const submissionData = {
            ...data,
            assetType,
        }

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
                // error={errors.symbolID?.message}
                assetType={assetType}
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
                    registration={register('transactionQuantity', validations.transactionQuantity)}
                    error={errors.transactionQuantity?.message}
                />
                <Field
                    label="Date"
                    type="date"
                    registration={register('transactionDate', validations.transactionDate)}
                    error={errors.transactionDate?.message}
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <Field
                    label="Price"
                    type="number"
                    step="any"
                    registration={register('initialPrice', validations.initialPrice)}
                    error={errors.initialPrice?.message}
                />
                <Field
                    label="Commission"
                    type="number"
                    step="any"
                    registration={register('transactionCommision', validations.transactionCommision)}
                    error={errors.transactionCommision?.message}
                />
                <SelectField
                    label="Currency"
                    registration={register('transactionCurrency')}
                    options={transactionCurrencyOptions}
                />
            </div>

            {isBond && (
                <div className="grid grid-cols-3 gap-4 items-center">
                    <Field
                        label="Bond Nominal"
                        type="number"
                        step="any"
                        registration={register('bondNominal', validations.bondNominal)}
                        error={errors.bondNominal?.message}
                    />
                    <Field
                        label="Accrued Interest (AI)"
                        type="number"
                        step="any"
                        registration={register('bondAccruedInterest', validations.bondAccruedInterest)}
                        error={errors.bondAccruedInterest?.message}
                    />
                    <div className="flex pb-3 w-full h-full justify-start items-end">
                        <Checkbox label="AI per Bond" registration={register('isAccruedInterestPerBond')} />
                    </div>
                </div>
            )}

            <TextareaField
                label="Notes"
                registration={register('notes', validations.notes)}
                error={errors.notes?.message}
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
                    <Button type="submit">Save Transaction</Button>
                </div>
            </div>
        </form>
    )
}

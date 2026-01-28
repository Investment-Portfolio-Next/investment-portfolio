'use client'
import { InfoModalWrapper } from './InfoModalWrapper'

type Props = Omit<React.ComponentProps<typeof InfoModalWrapper>, 'type'>

export function ErrorModal(props: Props) {
    return <InfoModalWrapper {...props} type="error" />
}

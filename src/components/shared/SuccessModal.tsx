'use client'

import { InfoModalWrapper } from './InfoModalWrapper'

type Props = Omit<React.ComponentProps<typeof InfoModalWrapper>, 'type'>

export function SuccessModal(props: Props) {
    return <InfoModalWrapper {...props} type="success" />
}

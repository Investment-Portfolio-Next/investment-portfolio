'use client'

import { InfoModal } from './InfoModal'

type Props = Omit<React.ComponentProps<typeof InfoModal>, 'type'>

export function ErrorModal(props: Props) {
    return <InfoModal {...props} type="error" />
}

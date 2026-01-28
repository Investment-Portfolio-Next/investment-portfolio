'use client'

import { InfoModal } from './InfoModal'

type Props = Omit<React.ComponentProps<typeof InfoModal>, 'type'>

export function SuccessModal(props: Props) {
  return <InfoModal {...props} type="success" />
}

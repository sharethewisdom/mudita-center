/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/LICENSE.md
 */

export interface PhoneProps {
  batteryLevel: number
  network?: string
  networkLevel?: number
  onDisconnect: () => void
  onClick?: () => void
}

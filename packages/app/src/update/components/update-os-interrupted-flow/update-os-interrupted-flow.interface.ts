/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import { OsRelease } from "App/update/dto"

export interface UpdateOsInterruptedFlowProps {
  onClose: () => void
  alreadyDownloadedReleases: OsRelease[]
  openContactSupportFlow: () => void
  downloadInterruptedModalOpened: boolean
  updateInterruptedModalOpened: boolean
}
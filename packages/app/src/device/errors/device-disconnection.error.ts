/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import { DeviceError } from "App/device/constants"

export class DeviceDisconnectionError extends Error {
  public type = DeviceError.Disconnection

  constructor(public message: string, public payload?: any) {
    super()

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DeviceDisconnectionError)
    }
  }
}
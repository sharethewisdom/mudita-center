/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import { ipcRenderer } from "electron-better-ipc"
import { IpcDesktopEvent } from "Core/desktop/desktop.constants"

export const addUserToSerialPortGroup = (): Promise<void> => {
  return ipcRenderer.callMain(IpcDesktopEvent.AddUserToSerialPortGroup)
}

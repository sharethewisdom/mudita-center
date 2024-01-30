/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

export enum DeviceManagerEvent {
  HandleDeviceActivated = "HANDLE_DEVICE_ACTIVATED",
  AddDevice = "ADD_DEVICE",
  RemoveDevice = "REMOVE_DEVICE",
  SetActiveDevice = "SET_ACTIVE_DEVICE",
  DeactivateDevice = "DEACTIVATE_DEVICE",
  ConfigureDevice = "CONFIGURE_DEVICE",
}
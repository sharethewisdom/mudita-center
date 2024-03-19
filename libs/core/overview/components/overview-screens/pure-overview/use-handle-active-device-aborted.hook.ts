/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import { useHistory } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useCallback } from "react"
import { TmpDispatch } from "Core/__deprecated__/renderer/store"
import { deactivateDevice } from "Core/device-manager/actions/deactivate-device.action"
import {
  URL_DISCOVERY_DEVICE,
  URL_MAIN,
} from "Core/__deprecated__/renderer/constants/urls"
import { setDiscoveryStatus } from "Core/discovery-device/actions/base.action"
import { DiscoveryStatus } from "Core/discovery-device/reducers/discovery-device.interface"
import { setDeviceInitializationStatus } from "Core/device-initialization/actions/base.action"
import { DeviceInitializationStatus } from "Core/device-initialization/reducers/device-initialization.interface"

export const useHandleActiveDeviceAborted = () => {
  const history = useHistory()
  const dispatch = useDispatch<TmpDispatch>()

  return useCallback(async () => {
    const { payload: devices } = await dispatch(deactivateDevice())
    const pathname = history.location.pathname

    dispatch(setDiscoveryStatus(DiscoveryStatus.Aborted))
    dispatch(setDeviceInitializationStatus(DeviceInitializationStatus.Aborted))
    if (devices.length > 1 && !pathname.includes(URL_DISCOVERY_DEVICE.root)) {
      history.push(URL_DISCOVERY_DEVICE.availableDeviceListModal)
    } else {
      history.push(URL_MAIN.news)
    }
  }, [history, dispatch])
}

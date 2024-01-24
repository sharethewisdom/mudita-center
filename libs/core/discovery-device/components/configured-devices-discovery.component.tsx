/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { FunctionComponent } from "Core/core/types/function-component.interface"
import { setDiscoveryStatus } from "Core/discovery-device/actions/base.action"
import { DiscoveryStatus } from "Core/discovery-device/reducers/discovery-device.interface"
import ConnectingContent from "Core/connecting/components/connecting-content.component"
import { getDevicesSelector } from "Core/device-manager/selectors/get-devices.selector"
import { handleDeviceActivated } from "Core/device-manager/actions/handle-device-activated.action"
import { Dispatch } from "Core/__deprecated__/renderer/store"
import AvailableDeviceList from "Core/discovery-device/components/available-device-list.component"
import { registerDeviceConnectedListener } from "Core/device-manager/listeners/device-connected.listener"
import {
  URL_DEVICE_INITIALIZATION,
  URL_MAIN,
  URL_ONBOARDING,
} from "Core/__deprecated__/renderer/constants/urls"
import { getAvailableDevicesSelector } from "Core/device-manager/selectors/get-available-devices.selector"
import { getFailedDevicesSelector } from "Core/device-manager/selectors/get-failed-devices.selector"

const ConfiguredDevicesDiscovery: FunctionComponent = () => {
  const history = useHistory()
  const dispatch = useDispatch<Dispatch>()
  const devices = useSelector(getDevicesSelector)
  const failedDevices = useSelector(getFailedDevicesSelector)
  const availableDevices = useSelector(getAvailableDevicesSelector)

  useEffect(() => {
    dispatch(setDiscoveryStatus(DiscoveryStatus.Discovering))
  }, [history, dispatch])

  const [noNewDevicesDetectedState, setNoNewDevicesDetectedState] =
    useState<boolean>(false)

  useEffect(() => {
    if (
      devices.length === 1 &&
      failedDevices.length === 1 &&
      noNewDevicesDetectedState
    ) {
      history.push(URL_ONBOARDING.troubleshooting)
      return
    }

    const handleDeviceActivation = async () => {
      await dispatch(handleDeviceActivated(devices[0].id))
      history.push(URL_DEVICE_INITIALIZATION.root)
    }

    if (
      devices.length === 1 &&
      availableDevices.length === 1 &&
      noNewDevicesDetectedState
    ) {
      void handleDeviceActivation()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    history,
    dispatch,
    devices,
    failedDevices.length,
    availableDevices.length,
    noNewDevicesDetectedState,
  ])

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>

    const handler = () => {
      clearTimeout(timeoutId)

      timeoutId = setTimeout(() => {
        setNoNewDevicesDetectedState(true)
      }, 5000)
    }
    handler()
    const deviceConnected = registerDeviceConnectedListener(handler)
    return () => {
      deviceConnected()
      clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    if (devices.length === 0 && noNewDevicesDetectedState) {
      dispatch(setDiscoveryStatus(DiscoveryStatus.Aborted))
      history.push(URL_MAIN.news)
    }
  }, [dispatch, history, devices.length, noNewDevicesDetectedState])

  if (
    devices.length > 1 &&
    availableDevices.length === devices.length &&
    noNewDevicesDetectedState
  ) {
    return <AvailableDeviceList />
  } else {
    return <ConnectingContent />
  }
}

export default ConfiguredDevicesDiscovery

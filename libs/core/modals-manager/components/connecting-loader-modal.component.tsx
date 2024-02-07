/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { defineMessages } from "react-intl"
import { useHistory } from "react-router-dom"
import { FunctionComponent } from "Core/core/types/function-component.interface"
import { intl } from "Core/__deprecated__/renderer/utils/intl"
import LoaderModal from "Core/ui/components/loader-modal/loader-modal.component"
import { Dispatch } from "Core/__deprecated__/renderer/store"
import { registerDeviceConnectedListener } from "Core/device-manager/listeners/device-connected.listener"
import { registerDeviceConnectFailedListener } from "Core/device-manager/listeners/device-connect-failed.listener"
import { URL_DISCOVERY_DEVICE } from "Core/__deprecated__/renderer/constants/urls"
import { setSelectDeviceDrawerOpen } from "Core/device-select/actions/set-select-device-drawer-open.action"
import { getDiscoveryStatus } from "Core/discovery-device/selectors/get-discovery-status.selector"
import { DiscoveryStatus } from "Core/discovery-device/reducers/discovery-device.interface"
import { ModalLayers } from "Core/modals-manager/constants/modal-layers.enum"
import {
  CONNECTING_LOADER_MODAL_ID,
  useLoaderSkipOnConnect,
} from "Core/modals-manager/components/use-loader-skip-on-connect.hook"

const messages = defineMessages({
  subtitle: {
    id: "component.connectingLoaderModal.subtitle",
  },
})

const ConnectingLoaderModal: FunctionComponent = () => {
  const dispatch = useDispatch<Dispatch>()
  const [openModal, setOpenModal] = useState<boolean>(false)

  const history = useHistory()

  const discoveryStatus = useSelector(getDiscoveryStatus)
  const shouldLoaderSkipOnConnect = useLoaderSkipOnConnect()

  useEffect(() => {
    const handler = async () => {
      if (shouldLoaderSkipOnConnect()) {
        setOpenModal(false)
      } else {
        setOpenModal(true)
      }
    }

    const unregisterDeviceConnectedListener =
      registerDeviceConnectedListener(handler)
    const unregisterDeviceConnectFailedListener =
      registerDeviceConnectFailedListener(handler)

    return () => {
      unregisterDeviceConnectedListener()
      unregisterDeviceConnectFailedListener()
    }
  }, [shouldLoaderSkipOnConnect])

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>

    if (openModal) {
      timeoutId = setTimeout(() => {
        setOpenModal(false)
        const pathname = history.location.pathname
        if (
          !pathname.includes(URL_DISCOVERY_DEVICE.root) &&
          discoveryStatus !== DiscoveryStatus.Aborted
        ) {
          dispatch(setSelectDeviceDrawerOpen(true))
        }
      }, 3000)
    }

    const unregister = history.listen((location) => {
      if (location.pathname.includes(URL_DISCOVERY_DEVICE.root)) {
        clearTimeout(timeoutId)
        setOpenModal(false)
      }
    })

    return () => {
      clearTimeout(timeoutId)
      unregister()
    }
  }, [openModal, dispatch, discoveryStatus, history])

  return (
    <LoaderModal
      data={{ "modal-id": CONNECTING_LOADER_MODAL_ID }}
      subtitle={intl.formatMessage(messages.subtitle)}
      open={openModal}
      layer={ModalLayers.ConnectingLoader}
    />
  )
}

export default ConnectingLoaderModal

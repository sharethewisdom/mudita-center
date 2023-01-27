/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import React, { useEffect, useState } from "react"
import { useHistory } from "react-router"
import { PayloadAction } from "@reduxjs/toolkit"
import { DeviceType, CONNECTION_TIME_OUT_MS } from "App/device/constants"
import {
  URL_MAIN,
  URL_ONBOARDING,
  URL_OVERVIEW,
} from "App/__deprecated__/renderer/constants/urls"
import ConnectingContent from "App/connecting/components/connecting-content.component"
import ErrorConnectingModal from "App/connecting/components/error-connecting-modal"
import { FunctionComponent } from "App/__deprecated__/renderer/types/function-component.interface"
import PasscodeModal from "App/__deprecated__/passcode-modal/passcode-modal.component"
import { SynchronizationState } from "App/data-sync/reducers"
import ErrorSyncModal from "App/connecting/components/error-sync-modal/error-sync-modal"
import { ConnectingError } from "App/connecting/components/connecting-error.enum"
import { AppError } from "App/core/errors"

const Connecting: FunctionComponent<{
  loaded: boolean
  deviceType: DeviceType | null
  unlocked: boolean | null
  syncInitialized: boolean
  syncState: SynchronizationState
  unlockDevice: (code: number[]) => Promise<PayloadAction<boolean>>
  getUnlockStatus: () => Promise<PayloadAction<boolean | AppError>>
  leftTime: number | undefined
  noModalsVisible: boolean
  forceOsUpdateFailed: boolean
  checkingForOsForceUpdate: boolean
  updateAllIndexes: () => Promise<void>
  passcodeModalCloseable: boolean
}> = ({
  loaded,
  deviceType,
  unlocked,
  syncInitialized,
  syncState,
  unlockDevice,
  getUnlockStatus,
  leftTime,
  noModalsVisible,
  updateAllIndexes,
  forceOsUpdateFailed,
  checkingForOsForceUpdate,
  passcodeModalCloseable,
}) => {
  const [error, setError] = useState<ConnectingError | null>(null)
  const [longerConnection, setLongerConnection] = useState(false)
  const [passcodeOpenModal, setPasscodeOpenModal] = useState(false)

  useEffect(() => {
    if (deviceType === DeviceType.MuditaHarmony) {
      return
    }
    const timeout = setTimeout(() => {
      setLongerConnection(true)
    }, 6000)
    return () => clearTimeout(timeout)
  }, [deviceType])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (
        unlocked &&
        loaded &&
        syncInitialized &&
        !checkingForOsForceUpdate &&
        !forceOsUpdateFailed
      ) {
        history.push(URL_OVERVIEW.root)
      }
    }, 500)

    // TODO: how to avoid window jumping by loading setting async action
    if (unlocked === false && noModalsVisible) {
      setPasscodeOpenModal(true)
    } else {
      setPasscodeOpenModal(false)
    }
    return () => clearTimeout(timeout)
    // AUTO DISABLED - fix me if you like :)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    loaded,
    unlocked,
    syncInitialized,
    noModalsVisible,
    checkingForOsForceUpdate,
    forceOsUpdateFailed,
  ])

  useEffect(() => {
    if (unlocked !== null) {
      return
    }

    let mounted = true
    const timeout = setTimeout(() => {
      if (mounted) {
        setError(ConnectingError.Connecting)
      }
      // the value is a little higher than API timeoutMs
    }, CONNECTION_TIME_OUT_MS + 5000)

    return () => {
      mounted = false
      clearTimeout(timeout)
    }
  }, [unlocked])

  useEffect(() => {
    if (unlocked && syncState === SynchronizationState.Error) {
      setError(ConnectingError.Sync)
    }
  }, [syncInitialized, syncState, unlocked])

  useEffect(() => {
    if (unlocked && forceOsUpdateFailed) {
      setError(ConnectingError.ForceUpdateCheckFailed)
    }
  }, [unlocked, forceOsUpdateFailed])

  const history = useHistory()

  const onCancel = () => {
    // TODO: do some logic to connect to the phone, add cancelling logic
    // This redirect is only for testing purposes

    // TODO: on success call registerFirstPhoneConnection function
    history.push(URL_ONBOARDING.troubleshooting)
  }

  const close = () => {
    setPasscodeOpenModal(false)
    history.push(URL_MAIN.news)
  }

  const onRetry = () => {
    setError(null)
    void updateAllIndexes()
  }

  return (
    <>
      {error === ConnectingError.Sync && (
        <ErrorSyncModal open onRetry={onRetry} closeModal={close} />
      )}
      {error === ConnectingError.Connecting && (
        <ErrorConnectingModal open closeModal={close} />
      )}
      {error === ConnectingError.ForceUpdateCheckFailed && (
        <ErrorConnectingModal open closeModal={close} />
      )}
      <PasscodeModal
        openModal={passcodeOpenModal}
        close={close}
        leftTime={leftTime}
        unlockDevice={unlockDevice}
        getUnlockStatus={getUnlockStatus}
        canBeClosed={passcodeModalCloseable}
      />
      <ConnectingContent
        onCancel={onCancel}
        longerConnection={longerConnection}
      />
    </>
  )
}

export default Connecting

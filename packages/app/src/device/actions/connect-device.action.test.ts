/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import createMockStore from "redux-mock-store"
import thunk from "redux-thunk"
import { AnyAction } from "@reduxjs/toolkit"
import { DeviceType } from "App/device/constants"
import {
  pendingAction,
  fulfilledAction,
} from "App/__deprecated__/renderer/store/helpers"
import { connectDevice } from "./connect-device.action"
import {
  ConnectionState,
  DeviceError,
  DeviceCommunicationError,
} from "App/device/constants"
import { connectDeviceRequest } from "App/device/requests/connect-device.request"
import { testError } from "App/__deprecated__/renderer/store/constants"
import { RequestResponseStatus } from "App/core/types/request-response.interface"
import { AppError } from "App/core/errors"
import { Result } from "App/core/builder"

type MockedAction = {
  type: string
  // AUTO DISABLED - fix me if you like :)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any
  // AUTO DISABLED - fix me if you like :)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta: any
}

const mockStore = createMockStore([thunk])({
  device: {
    state: ConnectionState.Empty,
  },
})

jest.mock("App/__deprecated__/renderer/requests/get-device-info.request", () =>
  jest.fn().mockReturnValue({
    status: RequestResponseStatus.Ok,
  })
)
jest.mock("App/__deprecated__/renderer/requests/get-network-info.request", () =>
  jest.fn().mockReturnValue({
    status: RequestResponseStatus.Ok,
  })
)
jest.mock("App/__deprecated__/renderer/requests/get-storage-info.request", () =>
  jest.fn().mockReturnValue({
    status: RequestResponseStatus.Ok,
  })
)
jest.mock("App/__deprecated__/renderer/requests/get-battery-info.request", () =>
  jest.fn().mockReturnValue({
    status: RequestResponseStatus.Ok,
  })
)
jest.mock("App/device/actions/load-device-data.action", () => ({
  loadDeviceData: jest.fn().mockReturnValue({
    type: pendingAction("DEVICE_DATA_LOADING"),
    payload: undefined,
  }),
}))
jest.mock("App/device/actions/set-connection-status.action", () => ({
  setConnectionStatus: jest.fn().mockReturnValue({
    type: pendingAction("DEVICE_SET_CONNECTION_STATE"),
    payload: true,
  }),
}))
jest.mock("App/device/actions/locked-device.action", () => ({
  lockedDevice: jest.fn().mockReturnValue({
    type: pendingAction("DEVICE_LOCKED"),
    payload: undefined,
  }),
}))

jest.mock("App/device/requests/connect-device.request")

afterEach(() => {
  mockStore.clearActions()
})

describe("Connect Device request returns `success` status", () => {
  test("fire async `connectDevice` action and execute `SetSimData` event", () => {
    ;(connectDeviceRequest as jest.Mock).mockReturnValueOnce(
      Result.success(true)
    )

    // AUTO DISABLED - fix me if you like :)
    // eslint-disable-next-line @typescript-eslint/await-thenable
    void mockStore.dispatch(
      connectDevice(DeviceType.MuditaPure) as unknown as AnyAction
    )

    const actions = mockStore.getActions() as MockedAction[]

    expect(
      actions.map(({ type, payload }) => {
        // AUTO DISABLED - fix me if you like :)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        return { type, payload }
      })
    ).toEqual([
      {
        type: pendingAction("DEVICE_CONNECTED"),
        payload: undefined,
      },
      {
        type: "DEVICE_UNLOCKED",
        payload: undefined,
      },
      {
        type: pendingAction("DEVICE_SET_CONNECTION_STATE"),
        payload: true,
      },
      {
        type: pendingAction("DEVICE_DATA_LOADING"),
        payload: undefined,
      },
      {
        type: pendingAction("CHECK_FOR_FORCE_UPDATE"),
        payload: undefined,
      },
      {
        type: fulfilledAction("CHECK_FOR_FORCE_UPDATE"),
        payload: false,
      },
      {
        type: fulfilledAction("DEVICE_CONNECTED"),
        payload: DeviceType.MuditaPure,
      },
    ])

    expect(connectDeviceRequest).toHaveBeenCalled()
  })
})

describe("Connect Device request returns `error` status", () => {
  test("fire async `connectDevice` action and execute `rejected` event", async () => {
    ;(connectDeviceRequest as jest.Mock).mockReturnValueOnce(
      Result.failed(new AppError("", ""))
    )

    const errorMock = new AppError(
      DeviceError.Connection,
      "Cannot connected to device"
    )
    const {
      meta: { requestId },
      // AUTO DISABLED - fix me if you like :)
      // eslint-disable-next-line @typescript-eslint/await-thenable
    } = await mockStore.dispatch(
      connectDevice(DeviceType.MuditaPure) as unknown as AnyAction
    )

    expect(mockStore.getActions()).toEqual([
      connectDevice.pending(requestId, DeviceType.MuditaPure),
      connectDevice.rejected(
        testError,
        requestId,
        DeviceType.MuditaPure,
        errorMock
      ),
    ])
  })
})

describe("Connect Device request returns `error` with type `DeviceCommunicationError.DeviceLocked`", () => {
  test("fire async `connectDevice` action and execute `lockedDevice` action", () => {
    ;(connectDeviceRequest as jest.Mock).mockReturnValueOnce(
      Result.failed(
        new AppError(DeviceCommunicationError.DeviceLocked, "Device is locked")
      )
    )

    // AUTO DISABLED - fix me if you like :)
    // eslint-disable-next-line @typescript-eslint/await-thenable
    mockStore.dispatch(
      connectDevice(DeviceType.MuditaPure) as unknown as AnyAction
    )

    const actions = mockStore.getActions() as MockedAction[]

    expect(
      actions.map(({ type, payload }) => {
        // AUTO DISABLED - fix me if you like :)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        return { type, payload }
      })
    ).toEqual([
      {
        type: pendingAction("DEVICE_CONNECTED"),
        payload: undefined,
      },
      {
        type: pendingAction("DEVICE_LOCKED"),
        payload: undefined,
      },
      {
        type: pendingAction("DEVICE_SET_CONNECTION_STATE"),
        payload: true,
      },
      {
        type: pendingAction("DEVICE_DATA_LOADING"),
        payload: undefined,
      },
      {
        type: pendingAction("CHECK_FOR_FORCE_UPDATE"),
        payload: undefined,
      },
      {
        type: fulfilledAction("CHECK_FOR_FORCE_UPDATE"),
        payload: false,
      },
      {
        type: fulfilledAction("DEVICE_CONNECTED"),
        payload: DeviceType.MuditaPure,
      },
    ])
  })
})

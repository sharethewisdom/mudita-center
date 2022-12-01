/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import { AnyAction } from "@reduxjs/toolkit"
import { Result, ResultObject } from "App/core/builder"
import { AppError } from "App/core/errors"
import { downloadUpdate } from "App/update/actions/download-update/download-update.action"
import { Product, ReleaseType, UpdateError } from "App/update/constants"
import { Release } from "App/update/dto"
import { DownloadStatus } from "App/__deprecated__/renderer/interfaces/file-download.interface"
import { testError } from "App/__deprecated__/renderer/store/constants"
import * as downloadOsUpdateRequestModule from "App/update/requests/download-os-update.request"
import * as osUpdateAlreadyDownloadedCheckModule from "App/update/requests/os-update-already-downloaded.request"
import createMockStore from "redux-mock-store"
import thunk from "redux-thunk"

const mockedRelease: Release = {
  date: "2021-02-02",
  file: {
    name: "test file",
    size: 123,
    url: "some-url",
  },
  product: Product.PurePhone,
  type: ReleaseType.Daily,
  version: "123",
  mandatoryVersions: [],
}

const params = { release: mockedRelease }

describe("when battery is lower than 40%", () => {
  test("the action is rejected", async () => {
    const mockStore = createMockStore([thunk])({
      device: {
        data: {
          batteryLevel: 0.39,
        },
      },
    })

    const {
      meta: { requestId },
      // AUTO DISABLED - fix me if you like :)
      // eslint-disable-next-line @typescript-eslint/await-thenable
    } = await mockStore.dispatch(downloadUpdate(params) as unknown as AnyAction)

    const error = new AppError(
      UpdateError.TooLowBattery,
      "Device has too low battery level"
    )

    expect(mockStore.getActions()).toEqual([
      downloadUpdate.pending(requestId, params),
      downloadUpdate.rejected(testError, requestId, params, error),
    ])
  })
})

describe("when update has already been downloaded", () => {
  test("the action is fulfilled", async () => {
    jest
      .spyOn(
        osUpdateAlreadyDownloadedCheckModule,
        "osUpdateAlreadyDownloadedCheck"
      )
      .mockResolvedValueOnce(true)

    const mockStore = createMockStore([thunk])({
      device: {
        data: {
          batteryLevel: 0.55,
        },
      },
    })

    const {
      meta: { requestId },
      // AUTO DISABLED - fix me if you like :)
      // eslint-disable-next-line @typescript-eslint/await-thenable
    } = await mockStore.dispatch(downloadUpdate(params) as unknown as AnyAction)

    expect(mockStore.getActions()).toEqual([
      downloadUpdate.pending(requestId, params),
      downloadUpdate.fulfilled(undefined, requestId, params),
    ])
  })
})

describe("when update downloads successfully", () => {
  test("the action is fulfilled", async () => {
    jest
      .spyOn(
        osUpdateAlreadyDownloadedCheckModule,
        "osUpdateAlreadyDownloadedCheck"
      )
      .mockResolvedValueOnce(false)

    jest
      .spyOn(downloadOsUpdateRequestModule, "downloadOsUpdateRequest")
      .mockResolvedValueOnce(
        Result.success({
          directory: "somedir",
          status: DownloadStatus.Completed,
          totalBytes: 123,
        })
      )

    const mockStore = createMockStore([thunk])({
      device: {
        data: {
          batteryLevel: 0.55,
        },
      },
    })

    const {
      meta: { requestId },
      // AUTO DISABLED - fix me if you like :)
      // eslint-disable-next-line @typescript-eslint/await-thenable
    } = await mockStore.dispatch(downloadUpdate(params) as unknown as AnyAction)

    expect(mockStore.getActions()).toEqual([
      downloadUpdate.pending(requestId, params),
      downloadUpdate.fulfilled(undefined, requestId, params),
    ])
  })
})

describe("when download is cancelled by user", () => {
  test("action is rejected with cancelled error", async () => {
    jest
      .spyOn(
        osUpdateAlreadyDownloadedCheckModule,
        "osUpdateAlreadyDownloadedCheck"
      )
      .mockResolvedValueOnce(false)

    const resultWithCancelledError: ResultObject<DownloadStatus.Cancelled> =
      Result.failed(new AppError("", ""), DownloadStatus.Cancelled)
    jest
      .spyOn(downloadOsUpdateRequestModule, "downloadOsUpdateRequest")
      .mockResolvedValueOnce(resultWithCancelledError)

    const mockStore = createMockStore([thunk])({
      device: {
        data: {
          batteryLevel: 0.55,
        },
      },
    })

    const {
      meta: { requestId },
      // AUTO DISABLED - fix me if you like :)
      // eslint-disable-next-line @typescript-eslint/await-thenable
    } = await mockStore.dispatch(downloadUpdate(params) as unknown as AnyAction)

    const error = new AppError(
      UpdateError.DownloadCancelledByUser,
      "Download cancelled by user"
    )

    expect(mockStore.getActions()).toEqual([
      downloadUpdate.pending(requestId, params),
      downloadUpdate.rejected(testError, requestId, params, error),
    ])
  })
})

describe("when download failed", () => {
  test("action is rejected with cancelled error", async () => {
    jest
      .spyOn(
        osUpdateAlreadyDownloadedCheckModule,
        "osUpdateAlreadyDownloadedCheck"
      )
      .mockResolvedValueOnce(false)

    const downloadFailedResult: ResultObject<DownloadStatus.Interrupted> =
      Result.failed(new AppError("", ""), DownloadStatus.Interrupted)
    jest
      .spyOn(downloadOsUpdateRequestModule, "downloadOsUpdateRequest")
      .mockResolvedValueOnce(downloadFailedResult)

    const mockStore = createMockStore([thunk])({
      device: {
        data: {
          batteryLevel: 0.55,
        },
      },
    })

    const {
      meta: { requestId },
      // AUTO DISABLED - fix me if you like :)
      // eslint-disable-next-line @typescript-eslint/await-thenable
    } = await mockStore.dispatch(downloadUpdate(params) as unknown as AnyAction)

    const error = new AppError(
      UpdateError.UnexpectedDownloadError,
      "Unexpected error while downloading update"
    )

    expect(mockStore.getActions()).toEqual([
      downloadUpdate.pending(requestId, params),
      downloadUpdate.rejected(testError, requestId, params, error),
    ])
  })
})

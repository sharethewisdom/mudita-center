/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import { isResponsesSuccessWithData } from "App/core/helpers/is-responses-success-with-data.helpers"
import {
  RequestResponse,
  RequestResponseStatus,
} from "App/core/types/request-response.interface"

const successResponseMock: RequestResponse<any> = {
  status: RequestResponseStatus.Ok,
  data: {},
}

const successResponseWithEmptyBodyMock: RequestResponse = {
  status: RequestResponseStatus.Ok,
}

const failedResponseMock: RequestResponse = {
  status: RequestResponseStatus.Error,
}

test("returns `true` if each response is succeeded", () => {
  expect(
    isResponsesSuccessWithData([
      successResponseMock,
      successResponseMock,
      successResponseMock,
    ])
  ).toBeTruthy()
})

test("returns `false` if one of responses is failed", () => {
  expect(
    isResponsesSuccessWithData([
      successResponseMock,
      successResponseMock,
      failedResponseMock,
    ])
  ).toBeFalsy()
})

test("returns `false` for success response if one of them haven't data", () => {
  expect(
    isResponsesSuccessWithData([
      successResponseMock,
      successResponseMock,
      successResponseWithEmptyBodyMock,
    ])
  ).toBeFalsy()
})

test("returns `false` if each response is failed", () => {
  expect(
    isResponsesSuccessWithData([
      failedResponseMock,
      failedResponseMock,
      failedResponseMock,
    ])
  ).toBeFalsy()
})
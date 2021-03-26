/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import { PureV1Formatter } from "./pure-v1.formatter"
import { Endpoint, Method, RequestConfig, ResponseStatus } from "../device"

const updateErrorResponse = {
  status: ResponseStatus.BadRequest,
  endpoint: Endpoint.Update,
  error: {
    code: 12,
    message:
      "prepareRoot ff_deltree on /sys/previous caused an error filesystem error: cannot remove all: Directory not empty [/sys/previous]",
  },
}

let formatter: PureV1Formatter

beforeEach(() => (formatter = new PureV1Formatter()))

test("correct error is returned when formatting", () => {
  const result = formatter.formatResponse(Method.Post, updateErrorResponse)
  expect(result.error?.code).toEqual(1012)
})

test("correct error is returned when input is directly passed to the handler", () => {
  const result = formatter.handleUpdateEndpointResponse(
    Method.Post,
    updateErrorResponse
  )
  expect(result.error?.code).toEqual(1012)
})

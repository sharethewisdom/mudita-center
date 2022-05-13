/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import { MessagesEvent } from "App/messages/constants"

export class DeleteThreadError extends Error {
  public type = MessagesEvent.DeleteThreads

  constructor(public message: string, public payload?: any) {
    super()

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DeleteThreadError)
    }
  }
}
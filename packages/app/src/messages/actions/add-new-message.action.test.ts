/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import createMockStore from "redux-mock-store"
import thunk from "redux-thunk"
import { AnyAction } from "@reduxjs/toolkit"
import { pendingAction } from "Renderer/store/helpers"
import { MessagesEvent } from "App/messages/constants"
import { testError } from "Renderer/store/constants"
import { AddNewMessageError } from "App/messages/errors"
import { createMessageRequest } from "App/messages/requests"
import { addNewMessage } from "App/messages/actions/add-new-message.action"
import { Message, MessageType, NewMessage } from "App/messages/reducers"
import { loadThreads } from "App/messages/actions/load-threads.action"
import { loadMessagesById } from "App/messages/actions/load-messages-by-id.action"
import {
  RequestResponse,
  RequestResponseStatus,
} from "App/core/types/request-response.interface"

jest.mock("App/messages/requests/create-message.request")
jest.mock("App/messages/actions/load-threads.action.ts", () => ({
  loadThreads: jest.fn().mockReturnValue({
    type: pendingAction(MessagesEvent.LoadThreads),
    payload: undefined,
  }),
}))
jest.mock("App/messages/actions/load-messages-by-id.action.ts", () => ({
  loadMessagesById: jest.fn().mockReturnValue({
    type: pendingAction(MessagesEvent.LoadMessagesById),
    payload: undefined,
  }),
}))

const mockAddedNewMessageData: NewMessage = {
  content:
    "Nulla itaque laborum delectus a id aliquam quod. Voluptas molestiae sit excepturi voluptas fuga cupiditate.",
  phoneNumber: "+48500600700",
}

const mockAddedMessageData: Message = {
  id: "6",
  date: new Date(),
  content: mockAddedNewMessageData.content,
  threadId: "1",
  phoneNumber: mockAddedNewMessageData.phoneNumber,
  messageType: MessageType.OUTBOX,
}

const successDeviceResponse: RequestResponse<Message> = {
  status: RequestResponseStatus.Ok,
  data: mockAddedMessageData,
}

const errorDeviceResponse: RequestResponse = {
  status: RequestResponseStatus.Error,
}

afterEach(() => {
  jest.resetAllMocks()
})

describe("async `addNewMessage` ", () => {
  describe("when `addMessage` request return success", () => {
    test("fire async `addNewMessage` call `loadThreads` and `loadMessagesById`", async () => {
      ;(createMessageRequest as jest.Mock).mockReturnValue(successDeviceResponse)
      const mockStore = createMockStore([thunk])()
      const {
        meta: { requestId },
      } = await mockStore.dispatch(
        addNewMessage(mockAddedNewMessageData) as unknown as AnyAction
      )

      expect(mockStore.getActions()).toEqual([
        addNewMessage.pending(requestId, mockAddedNewMessageData),
        {
          type: pendingAction(MessagesEvent.LoadThreads),
          payload: undefined,
        },
        {
          type: pendingAction(MessagesEvent.LoadMessagesById),
          payload: undefined,
        },
        addNewMessage.fulfilled(
          mockAddedMessageData,
          requestId,
          mockAddedNewMessageData
        ),
      ])

      expect(createMessageRequest).toHaveBeenCalled()
      expect(loadThreads).toHaveBeenCalled()
      expect(loadMessagesById).toHaveBeenCalled()
    })
  })

  describe("when `addMessage` request return error", () => {
    test("fire async `addNewMessage` returns `rejected` action", async () => {
      ;(createMessageRequest as jest.Mock).mockReturnValue(errorDeviceResponse)
      const errorMock = new AddNewMessageError("Add New Message request failed")
      const mockStore = createMockStore([thunk])()
      const {
        meta: { requestId },
      } = await mockStore.dispatch(
        addNewMessage(mockAddedNewMessageData) as unknown as AnyAction
      )

      expect(mockStore.getActions()).toEqual([
        addNewMessage.pending(requestId, mockAddedNewMessageData),
        addNewMessage.rejected(
          testError,
          requestId,
          mockAddedNewMessageData,
          errorMock
        ),
      ])

      expect(createMessageRequest).toHaveBeenCalled()
    })
  })
})

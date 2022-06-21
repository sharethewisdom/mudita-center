/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import { Controller, IpcEvent } from "App/core/decorators"
import { RequestResponse } from "App/core/types/request-response.interface"
import {
  CreateMessageDataResponse,
  MessageService,
} from "App/messages/services"
import {
  IpcMessageEvent,
  MessageControllerPrefix,
} from "App/messages/constants/controller.constant"
import { NewMessage } from "App/messages/reducers"

@Controller(MessageControllerPrefix)
export class MessageController {
  constructor(private messageService: MessageService) {}

  @IpcEvent(IpcMessageEvent.CreateMessage)
  public createMessage(
    newMessage: NewMessage
  ): Promise<RequestResponse<CreateMessageDataResponse>> {
    return this.messageService.createMessage(newMessage)
  }

  @IpcEvent(IpcMessageEvent.DeleteMessage)
  public async deleteMessage(messageId: string): Promise<RequestResponse> {
    return this.messageService.deleteMessage(messageId)
  }
}

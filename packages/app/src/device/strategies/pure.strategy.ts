/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import { EventEmitter } from "events"
import {
  Endpoint,
  Method,
  DeviceServiceEvent,
  DeviceCommunicationEvent,
  PhoneLockCategory,
} from "App/device/constants"
import {
  GetPhoneLockTimeResponseBody,
  RequestConfig,
  StartRestoreRequestConfig,
  RemoveFileSystemRequestConfig,
  GetSecurityRequestConfig,
  GetPhoneLockStatusRequestConfig,
  GetPhoneLockTimeRequestConfig,
  UnlockDeviceRequestConfig,
  GetDeviceInfoRequestConfig,
  GetDeviceInfoResponseBody,
  GetDeviceFilesRequestConfig,
  GetDeviceFilesResponseBody,
  GetMessagesRequestConfig,
  GetMessagesResponseBody,
  GetMessageRequestConfig,
  GetMessageResponseBody,
  GetThreadsRequestConfig,
  GetThreadsResponseBody,
  GetThreadRequestConfig,
  GetThreadResponseBody,
  CreateMessageRequestConfig,
  CreateMessageResponseBody,
  UpdateMessageRequestConfig,
  DeleteMessageRequestConfig,
  DeleteThreadRequestConfig,
  UpdateThreadReadUnreadStateRequestConfig,
  GetTemplateRequestConfig,
  GetTemplateResponseBody,
  GetTemplatesRequestConfig,
  GetTemplatesResponseBody,
  CreateTemplateRequestConfig,
  CreateTemplateResponseBody,
  UpdateTemplateRequestConfig,
  UpdateTemplateOrderRequestConfig,
  DeleteTemplateRequestConfig,
  GetContactsRequestConfig,
  GetContactsResponseBody,
  GetContactRequestConfig,
  GetContactResponseBody,
  CreateContactRequestConfig,
  CreateContactResponseBody,
  UpdateContactRequestConfig,
  UpdateContactResponseBody,
  DeleteContactRequestConfig,
  DeleteContactResponseBody,
  StartDeviceUpdateRequestBody,
  GetFileSystemDirectoryRequestConfig,
  GetFileSystemDirectoryResponseBody,
  GetFileSystemRequestConfig,
  GetFileSystemResponseBody,
  DownloadFileSystemRequestConfig,
  DownloadFileSystemResponseBody,
  SendFileSystemRequestConfig,
  SendFileSystemResponseBody,
  PutFileSystemRequestConfig,
  PutFileSystemResponseBody,
  StartBackupRequestConfig,
  StartBackupResponseBody,
  GetBackupDeviceStatusRequestConfig,
  GetBackupDeviceStatusResponseBody,
  GetRestoreDeviceStatusRequestConfig,
  GetRestoreDeviceStatusResponseBody,
  GetEntriesRequestConfig,
  GetEntriesResponseBody,
  DeleteEntriesRequestConfig,
} from "App/device/types/mudita-os"
import {
  RequestResponse,
  RequestResponseStatus,
} from "App/core/types/request-response.interface"
import { BaseAdapter } from "App/device/modules/base.adapter"
import { DeviceStrategy } from "App/device/strategies/device-strategy.class"
import { ResponsePresenter } from "App/device/modules/mudita-os/presenters"

export class PureStrategy implements DeviceStrategy {
  private eventEmitter = new EventEmitter()
  private lockedInterval: NodeJS.Timeout | undefined

  constructor(private adapter: BaseAdapter) {
    EventEmitter.defaultMaxListeners = 15
    this.mountDeviceUnlockedListener()
    this.mountDisconnectionListener()
  }

  public async connect(): Promise<RequestResponse<GetDeviceInfoResponseBody>> {
    const response = await this.request({
      endpoint: Endpoint.DeviceInfo,
      method: Method.Get,
    })

    if (
      response.status === RequestResponseStatus.Ok ||
      response.status === RequestResponseStatus.PhoneLocked
    ) {
      this.eventEmitter.emit(DeviceServiceEvent.DeviceConnected)
    }

    return response
  }

  public async disconnect(): Promise<boolean> {
    const response = await this.adapter.disconnect()

    this.unmountDeviceUnlockedListener()
    this.unmountDisconnectionListener()
    this.eventEmitter.emit(DeviceServiceEvent.DeviceDisconnected)

    return Boolean(response.data)
  }

  public async request(
    config: GetSecurityRequestConfig
  ): Promise<RequestResponse>
  public async request(
    config: GetPhoneLockStatusRequestConfig
  ): Promise<RequestResponse>
  public async request(
    config: GetPhoneLockTimeRequestConfig
  ): Promise<RequestResponse<GetPhoneLockTimeResponseBody>>
  public async request(
    config: UnlockDeviceRequestConfig
  ): Promise<RequestResponse>
  public async request(
    config: GetDeviceInfoRequestConfig
  ): Promise<RequestResponse<GetDeviceInfoResponseBody>>
  public async request(
    config: GetDeviceFilesRequestConfig
  ): Promise<RequestResponse<GetDeviceFilesResponseBody>>

  public async request(
    config: GetMessagesRequestConfig
  ): Promise<RequestResponse<GetMessagesResponseBody>>
  public async request(
    config: GetMessageRequestConfig
  ): Promise<RequestResponse<GetMessageResponseBody>>
  public async request(
    config: GetThreadsRequestConfig
  ): Promise<RequestResponse<GetThreadsResponseBody>>
  public async request(
    config: GetThreadRequestConfig
  ): Promise<RequestResponse<GetThreadResponseBody>>
  public async request(
    config: CreateMessageRequestConfig
  ): Promise<RequestResponse<CreateMessageResponseBody>>
  public async request(
    config: UpdateMessageRequestConfig
  ): Promise<RequestResponse>
  public async request(
    config: DeleteThreadRequestConfig
  ): Promise<RequestResponse>
  public async request(
    config: DeleteMessageRequestConfig
  ): Promise<RequestResponse>
  public async request(
    config: UpdateThreadReadUnreadStateRequestConfig
  ): Promise<RequestResponse>
  public async request(
    config: GetTemplatesRequestConfig
  ): Promise<RequestResponse<GetTemplatesResponseBody>>
  public async request(
    config: GetTemplateRequestConfig
  ): Promise<RequestResponse<GetTemplateResponseBody>>
  public async request(
    config: CreateTemplateRequestConfig
  ): Promise<RequestResponse<CreateTemplateResponseBody>>
  public async request(
    config: UpdateTemplateRequestConfig
  ): Promise<RequestResponse>
  public async request(
    config: UpdateTemplateOrderRequestConfig
  ): Promise<RequestResponse>
  public async request(
    config: DeleteTemplateRequestConfig
  ): Promise<RequestResponse>

  public async request(
    config: GetContactsRequestConfig
  ): Promise<RequestResponse<GetContactsResponseBody>>
  public async request(
    config: GetContactRequestConfig
  ): Promise<RequestResponse<GetContactResponseBody>>
  public async request(
    config: CreateContactRequestConfig
  ): Promise<RequestResponse<CreateContactResponseBody>>
  public async request(
    config: UpdateContactRequestConfig
  ): Promise<RequestResponse<UpdateContactResponseBody>>
  public async request(
    config: DeleteContactRequestConfig
  ): Promise<RequestResponse<DeleteContactResponseBody>>

  public async request(
    config: StartDeviceUpdateRequestBody
  ): Promise<RequestResponse>

  public async request(
    config: GetFileSystemDirectoryRequestConfig
  ): Promise<RequestResponse<GetFileSystemDirectoryResponseBody>>
  public async request(
    config: GetFileSystemRequestConfig
  ): Promise<RequestResponse<GetFileSystemResponseBody>>
  public async request(
    config: DownloadFileSystemRequestConfig
  ): Promise<RequestResponse<DownloadFileSystemResponseBody>>
  public async request(
    config: SendFileSystemRequestConfig
  ): Promise<RequestResponse<SendFileSystemResponseBody>>
  public async request(
    config: PutFileSystemRequestConfig
  ): Promise<RequestResponse<PutFileSystemResponseBody>>

  public async request(
    config: StartBackupRequestConfig
  ): Promise<RequestResponse<StartBackupResponseBody>>
  public async request(
    config: GetBackupDeviceStatusRequestConfig
  ): Promise<RequestResponse<GetBackupDeviceStatusResponseBody>>
  public async request(
    config: StartRestoreRequestConfig
  ): Promise<RequestResponse>
  public async request(
    config: GetRestoreDeviceStatusRequestConfig
  ): Promise<RequestResponse<GetRestoreDeviceStatusResponseBody>>
  public async request(
    config: RemoveFileSystemRequestConfig
  ): Promise<RequestResponse>
  public async request(
    config: GetEntriesRequestConfig
  ): Promise<RequestResponse<GetEntriesResponseBody>>
  public async request(
    config: DeleteEntriesRequestConfig
  ): Promise<RequestResponse>
  // AUTO DISABLED - fix me if you like :)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async request(config: RequestConfig<any>): Promise<RequestResponse> {
    const response = await this.adapter.request(config)
    const serializedResponse = ResponsePresenter.toResponseObject(response)

    this.checkResponseStatus(config, serializedResponse)

    return serializedResponse
  }

  public onCommunicationEvent(
    eventName: DeviceCommunicationEvent,
    listener: () => void
  ): void {
    this.adapter.on(eventName, listener)
  }

  public offCommunicationEvent(
    eventName: DeviceCommunicationEvent,
    listener: () => void
  ): void {
    this.adapter.off(eventName, listener)
  }

  public on(
    eventName: DeviceServiceEvent,
    // AUTO DISABLED - fix me if you like :)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listener: (path: string, ...args: any[]) => void
  ): void {
    this.eventEmitter.on(eventName, listener)
  }

  public off(
    eventName: DeviceServiceEvent,
    // AUTO DISABLED - fix me if you like :)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listener: (path: string, ...args: any[]) => void
  ): void {
    this.eventEmitter.off(eventName, listener)
  }

  private checkResponseStatus(
    // AUTO DISABLED - fix me if you like :)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: RequestConfig<any>,
    response: RequestResponse<unknown>
  ): void {
    if (
      config.endpoint === Endpoint.Security &&
      // AUTO DISABLED - fix me if you like :)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (config.body.category === PhoneLockCategory.Status ||
        // AUTO DISABLED - fix me if you like :)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        config.body.category === PhoneLockCategory.Time) &&
      response.status !== RequestResponseStatus.Ok
    ) {
      return
    }

    if (!this.isEndpointSecure(config)) {
      return
    }

    if (response.status === RequestResponseStatus.Error) {
      return
    }

    if (response.status === RequestResponseStatus.PhoneLocked) {
      this.eventEmitter.emit(DeviceServiceEvent.DeviceLocked)
      this.eventEmitter.emit(DeviceServiceEvent.DeviceAgreementAccepted)
    } else if (response.status === RequestResponseStatus.Ok) {
      this.eventEmitter.emit(DeviceServiceEvent.DeviceUnlocked)
      this.eventEmitter.emit(DeviceServiceEvent.DeviceAgreementAccepted)
    } else if (response.status === RequestResponseStatus.EulaNotAccepted) {
      this.eventEmitter.emit(DeviceServiceEvent.DeviceAgreementNotAccepted)
    } else {
      this.eventEmitter.emit(DeviceServiceEvent.DeviceAgreementAccepted)
    }
  }

  // AUTO DISABLED - fix me if you like :)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isEndpointSecure(config: RequestConfig<any>): boolean {
    const isConfigEndpointSecurity = config.endpoint === Endpoint.Security
    const iSetPhoneLockOffEndpoint =
      isConfigEndpointSecurity && config.method === Method.Put
    const isPhoneLockTimeEndpoint =
      isConfigEndpointSecurity &&
      // AUTO DISABLED - fix me if you like :)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      config.body.category === PhoneLockCategory.Time

    if (!(iSetPhoneLockOffEndpoint || isPhoneLockTimeEndpoint)) {
      return true
    }

    return false
  }

  private mountDeviceUnlockedListener(): void {
    void this.getUnlockedStatusRequest()
    this.lockedInterval = setInterval(() => {
      void this.getUnlockedStatusRequest()
    }, 10000)
  }

  private unmountDeviceUnlockedListener(): void {
    clearInterval(this.lockedInterval)
  }

  private getUnlockedStatusRequest(): Promise<RequestResponse> {
    return this.request({
      endpoint: Endpoint.Security,
      method: Method.Get,
      body: { category: PhoneLockCategory.Status },
    })
  }

  private mountDisconnectionListener(): void {
    this.onCommunicationEvent(DeviceCommunicationEvent.Disconnected, () => {
      this.eventEmitter.emit(DeviceServiceEvent.DeviceDisconnected)
      this.unmountDeviceUnlockedListener()
    })
  }

  private unmountDisconnectionListener(): void {
    this.offCommunicationEvent(DeviceCommunicationEvent.Disconnected, () => {
      this.eventEmitter.emit(DeviceServiceEvent.DeviceDisconnected)
    })
  }
}

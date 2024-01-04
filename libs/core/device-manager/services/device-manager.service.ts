/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import SerialPort, { PortInfo as SerialPortInfo } from "serialport"
import { MainProcessIpc } from "electron-better-ipc"
import { log } from "Core/core/decorators/log.decorator"
import { DeviceResolverService } from "Core/device-manager/services/device-resolver.service"
import { AppError } from "Core/core/errors"
import { Result, ResultObject } from "Core/core/builder"
import {
  Device,
  getDevicePropertiesFromDevice,
} from "Core/device/modules/device"
import { PortInfo } from "Core/device-manager/types"
import { PortInfoValidator } from "Core/device-manager/validators"
import {
  DeviceManagerError,
  ListenerEvent,
} from "Core/device-manager/constants"
import { DeviceServiceEvent } from "Core/device"
import { EventEmitter } from "events"
import logger from "Core/__deprecated__/main/utils/logger"
import { Mutex } from "async-mutex"
import { APIDevice } from "device/feature"

export class DeviceManager {
  public currentDevice: Device | undefined
  private currentAPIDevice: APIDevice | undefined
  public devicesMap = new Map<string, Device>()
  public currentDeviceInitializationFailed = false

  // The `updating` property is a tmp solution to skip sync process
  // The tech debt will be fixed as part ot tech task
  // https://appnroll.atlassian.net/browse/CP-1765
  public updating = false

  constructor(
    private deviceResolver: DeviceResolverService,
    private ipc: MainProcessIpc,
    protected eventEmitter: EventEmitter
  ) {
    this.mountListeners()
  }

  get apiDevice() {
    if (!this.currentAPIDevice) {
      throw new AppError(
        DeviceManagerError.NoCurrentDevice,
        "Current device is undefined"
      )
    }

    return this.currentAPIDevice
  }

  get device(): Device {
    if (!this.currentDevice) {
      throw new AppError(
        DeviceManagerError.NoCurrentDevice,
        "Current device is undefined"
      )
    }

    return this.currentDevice
  }

  get devices(): Device[] {
    return Array.from(this.devicesMap.values())
  }

  private mutex = new Mutex()

  public async addDevice(port: PortInfo): Promise<void> {
    await this.mutex.runExclusive(async () => {
      await this.addDeviceTask(port)
    })
  }

  public async addDeviceTask(port: PortInfo): Promise<void> {
    if (this.currentDevice) {
      return
    }

    const device = await this.initializeDevice(port)

    if (!device) {
      throw new AppError(
        DeviceManagerError.CannotInitializeDeviceObject,
        `Cannot initialize device object for ${port.productId || ""}`
      )
    }

    this.devicesMap.set(device.path, device)

    if (!this.currentDevice) {
      this.currentDevice = device
      this.ipc.sendToRenderers(
        ListenerEvent.CurrentDeviceChanged,
        this.device.toSerializableObject()
      )
    }

    this.ipc.sendToRenderers(ListenerEvent.DeviceAttached)
    logger.info(`Connected device with serial number: ${device.serialNumber}`)
  }

  public removeDevice(path: string): void {
    this.devicesMap.delete(path)

    if (this.currentDevice?.path === path) {
      if (this.devicesMap.size > 0) {
        this.currentDevice = this.devicesMap.values().next().value as Device
        this.ipc.sendToRenderers(
          ListenerEvent.CurrentDeviceChanged,
          this.currentDevice
            ? getDevicePropertiesFromDevice(this.currentDevice)
            : undefined
        )
      } else {
        this.currentDevice = undefined
      }
    }

    this.ipc.sendToRenderers(ListenerEvent.DeviceDetached, path)
    logger.info(`Disconnected device with path: ${path}`)
  }

  public setCurrentDevice(path: string): ResultObject<boolean> {
    const newCurrentDevice = this.devicesMap.get(path)

    if (!newCurrentDevice) {
      return Result.failed(
        new AppError(
          DeviceManagerError.CannotFindDevice,
          `Device ${path} can't be found`
        )
      )
    }

    this.currentDevice = newCurrentDevice

    this.ipc.sendToRenderers(
      ListenerEvent.CurrentDeviceChanged,
      getDevicePropertiesFromDevice(this.currentDevice)
    )

    return Result.success(true)
  }

  public async getConnectedDevices(): Promise<SerialPortInfo[]> {
    const portList = await this.getSerialPortList()
    return (
      portList
        // AUTO DISABLED - fix me if you like :)
        // eslint-disable-next-line @typescript-eslint/unbound-method
        .filter(PortInfoValidator.isPortInfoMatch)
    )
  }

  private async initializeDevice(
    portInfo: PortInfo
  ): Promise<Device | undefined> {
    const sleep = () => new Promise((resolve) => setTimeout(resolve, 500))
    const retryLimit = 20

    portInfo.productId = portInfo.productId?.toUpperCase()
    portInfo.vendorId = portInfo.vendorId?.toUpperCase()

    const alreadyInitializedDevices = Array.from(this.devicesMap.keys())

    // AUTO DISABLED - fix me if you like :)
    // eslint-disable-next-line @typescript-eslint/no-misused-promises, no-async-promise-executor
    return new Promise(async (resolve) => {
      for (let i = 0; i < retryLimit; i++) {
        const portList = await this.getConnectedDevices()
        const port = portList.find(
          ({ productId, vendorId, path }) =>
            productId?.toUpperCase() === portInfo.productId &&
            vendorId?.toUpperCase() === portInfo.vendorId &&
            ((!portInfo.path && !alreadyInitializedDevices.includes(path)) ||
              path === portInfo.path)
        )

        if (port) {
          const device = this.deviceResolver.resolve(port)

          if (
            !device &&
            process.env.FEATURE_TOGGLE_ENVIRONMENT === "development"
          ) {
            //TODO: temporary, remove in future
            this.currentAPIDevice = new APIDevice(port)
          }

          if (!device) {
            return
          }

          return resolve(device)
        }
        await sleep()
      }

      resolve(undefined)
    })
  }

  @log("==== device manager: list ====")
  private getSerialPortList(): Promise<SerialPortInfo[]> {
    return SerialPort.list()
  }

  private mountListeners(): void {
    this.eventEmitter.on(
      DeviceServiceEvent.DeviceInitializationFailed,
      this.deviceInitializationFailedListener
    )
    this.eventEmitter.on(
      DeviceServiceEvent.DeviceConnected,
      this.deviceConnectedListener
    )
  }

  private deviceInitializationFailedListener = () => {
    this.currentDeviceInitializationFailed = true
  }
  private deviceConnectedListener = () => {
    this.currentDeviceInitializationFailed = false
  }
}

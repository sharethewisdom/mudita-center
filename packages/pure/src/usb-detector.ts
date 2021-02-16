/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/LICENSE.md
 */

import usb, { Device, DeviceDescriptor } from "usb"
import { EventEmitter } from "events"
import { PortInfo } from "serialport"

type UsbDetectorPortInfo = Omit<PortInfo, "path">

enum UsbDetectorEventName {
  Attach = "Attach",
}

class UsbDetector {
  #eventEmitter = new EventEmitter()

  public init(): UsbDetector {
    this.registerAttachDeviceEmitter()
    return this
  }

  public onAttachDevice(listener: (event: UsbDetectorPortInfo) => Promise<void> | void): void {
    this.#eventEmitter.on(UsbDetectorEventName.Attach, (event) => {
      void listener(event)
    })
  }

  public offAttachDevice(listener: (event: UsbDetectorPortInfo) => void): void {
    this.#eventEmitter.off(UsbDetectorEventName.Attach, listener)
  }

  private getDescriptor(
    device: Device,
    deviceDescriptor: keyof DeviceDescriptor
  ): Promise<string> {
    return new Promise((resolve) => {
      device.getStringDescriptor(
        device.deviceDescriptor[deviceDescriptor],
        (error, data = "") => {
          resolve(data)
        }
      )
    })
  }

  private async getPortInfo(device: Device): Promise<UsbDetectorPortInfo> {
    device.open()
    const manufacturer = await this.getDescriptor(device, "iManufacturer")
    const serialNumber = await this.getDescriptor(device, "iSerialNumber")
    device.close()
    return {
      manufacturer,
      serialNumber,
    }
  }

  private registerAttachDeviceEmitter() {
    usb.on("attach",  (device: Device) => {
      void this.getPortInfo(device).then(portInfo => {
        this.#eventEmitter.emit(UsbDetectorEventName.Attach, portInfo)
      })
    })
  }
}

export default UsbDetector

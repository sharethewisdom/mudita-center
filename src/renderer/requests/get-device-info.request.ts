import DeviceInfo from "Common/interfaces/device-info.interface"
import { IpcRequest } from "Common/requests/ipc-request.enum"
import { ipcRenderer } from "electron-better-ipc"
import DeviceResponse from "Backend/adapters/device-response.interface"

/**
 * Ask the main process for the device information.
 */
const getDeviceInfo = (): Promise<DeviceResponse<DeviceInfo>> => {
  return ipcRenderer.callMain(IpcRequest.GetDeviceInfo)
}

export default getDeviceInfo

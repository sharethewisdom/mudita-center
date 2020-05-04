import getFakeAdapters from "App/tests/get-fake-adapters"
import { ipcMain } from "electron-better-ipc"
import { IpcRequest } from "Common/requests/ipc-request.enum"
import registerAddContactRequest from "Backend/requests/phonebook/add-contact.request"
import { defaultContact } from "Renderer/components/rest/phone/contact-edit.component"
import { DeviceResponseStatus } from "Backend/adapters/device-response.interface"

test("adds contact properly", () => {
  registerAddContactRequest(getFakeAdapters())

  const [result] = (ipcMain as any)._flush(
    IpcRequest.AddContact,
    defaultContact
  )

  const { id } = result.data

  expect(result.data).toStrictEqual({ id, ...defaultContact })
  expect(result.status).toBe(DeviceResponseStatus.Ok)
})

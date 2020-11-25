import DeviceResponse from "Backend/adapters/device-response.interface"
import {
  Contact,
  ContactID,
  NewContact,
} from "Renderer/models/phone/phone.typings"

export default abstract class PhonebookAdapter {
  public abstract getContacts(): Promise<DeviceResponse<Contact[]>>
  public abstract addContact(contact: NewContact): Promise<DeviceResponse<Contact>>
  public abstract editContact(contact: Contact): DeviceResponse<Contact>
  public abstract deleteContacts(
    contactsIds: ContactID[]
  ): DeviceResponse<ContactID[]>
}
export type ContactUid = string

export interface Contact {
  id: ContactUid
  firstName: string
  lastName: string
  primaryPhoneNumber: string
  secondaryPhoneNumber: string
  favourite: boolean
  blocked: boolean
  ice: boolean
  speedDial?: number
  note: string
  email: string
  firstAddressLine: string
  secondAddressLine: string
}

export type NewContact = Omit<Contact, "id">

export interface ContactCategory {
  category: string
  contacts: Contact[]
}

export interface Contacts {
  contactList: ContactCategory[]
}

export interface StoreData {
  inputValue: string
  contacts: Contact[]
  savingContact: boolean
}

interface StoreSelectors extends Contacts {
  speedDialContacts: Contact[]
  savingContact: boolean
}

interface StoreEffects {
  readonly loadData?: () => void
  readonly addContact?: (contact: Contact) => void
  readonly editContact?: (contact: Contact) => void
  readonly deleteContacts?: (contacts: Contact[]) => void
}

export type Store = StoreEffects & StoreData & StoreSelectors

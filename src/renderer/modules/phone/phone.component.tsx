import React, { useEffect, useState } from "react"
import Button from "Renderer/components/core/button/button.component"
import ContactList from "Renderer/components/rest/phone/contact-list.component"
import ContactPanel, {
  ContactPanelProps,
} from "Renderer/components/rest/phone/contact-panel.component"
import { FunctionComponent } from "Renderer/types/function-component.interface"
import { TableWithSidebarWrapper } from "Renderer/components/core/table/table.component"
import ContactDetails, {
  ContactActions,
  ContactDetailsActions,
} from "Renderer/components/rest/phone/contact-details.component"
import useTableSidebar from "Renderer/utils/hooks/useTableSidebar"
import { Contact } from "Renderer/models/phone/phone.typings"
import ContactEdit, {
  defaultContact,
} from "Renderer/components/rest/phone/contact-edit.component"
import { noop } from "Renderer/utils/noop"
import modalService from "Renderer/components/core/modal/modal.service"
import SpeedDialModal from "Renderer/components/rest/phone/speed-dial-modal.container"
import BlockContactModal from "Renderer/components/rest/phone/block-contact-modal.component"
import { createFullName } from "Renderer/models/phone/phone.helpers"
import DevModeWrapper from "Renderer/components/rest/dev-mode-wrapper/dev-mode-wrapper.container"
import { intl, textFormatters } from "Renderer/utils/intl"
import DeleteModal from "App/renderer/components/core/modal/delete-modal.component"
import {
  ContactID,
  NewContact,
  ResultsState,
  Store,
} from "Renderer/models/phone/phone.typings"
import { ContactSection } from "Renderer/modules/phone/phone.styled"
import SyncContactsModal from "Renderer/components/rest/sync-modals/sync-contacts-modal.component"
import { Type } from "Renderer/components/core/icon/icon.config"
import Modal from "Renderer/components/core/modal/modal.component"
import { ModalSize } from "Renderer/components/core/modal/modal.interface"
import { SynchronizingContactsModal } from "Renderer/components/rest/sync-modals/synchronizing-contacts-modal.component"

export type PhoneProps = ContactActions &
  ContactPanelProps &
  ContactDetailsActions & {
    onSpeedDialSettingsSave: (contacts?: Contact[]) => void
    getContact: (id: ContactID) => Contact
    flatList: Contact[]
    removeContact?: (input: ContactID | ContactID[]) => void
  } & Partial<Store>

const Phone: FunctionComponent<PhoneProps> = (props) => {
  const {
    addContact,
    editContact,
    getContact,
    removeContact,
    contactList = [],
    onSearchTermChange,
    onCall,
    onMessage,
    savingContact,
    flatList,
  } = props
  const { openSidebar, closeSidebar, activeRow } = useTableSidebar<Contact>()
  const [newContact, setNewContact] = useState<NewContact>()
  const [editedContact, setEditedContact] = useState<Contact>()
  const [contacts, setContacts] = useState(contactList)
  const [sync, setSync] = useState(1)
  const detailsEnabled = activeRow && !newContact && !editedContact

  useEffect(() => {
    setContacts(contactList)
  }, [contactList])

  useEffect(() => {
    if (editedContact) {
      const newData = flatList.find(
        (contact) => contact.id === editedContact.id
      )

      if (newData) {
        setEditedContact((curr: any) => {
          if (newData.speedDial) {
            return {
              ...curr,
              speedDial: newData.speedDial,
            }
          }

          delete curr.speedDial
          return curr
        })
      }
    }
  }, [flatList])

  const contactFreshData = ({ id }: Contact) => {
    return getContact(id)
  }

  const handleNameUpdate = ({
    firstName,
    lastName,
  }: Pick<Contact, "firstName" | "lastName">) => {
    if (!editedContact) {
      setNewContact({
        ...(newContact as Contact),
        firstName,
        lastName,
      })
    }
  }

  const handleAddingContact = () => {
    closeSidebar()
    setNewContact(defaultContact)
  }

  const cancelOrCloseContactHandler = () => {
    closeSidebar()
    setNewContact(undefined)
  }

  const saveNewContact = (contact: Contact) => {
    if (addContact) {
      addContact(contact)
    }
    cancelOrCloseContactHandler()
  }

  const handleEditingContact = (contact: Contact) => {
    closeSidebar()
    setEditedContact(contact)
  }

  const cancelEditingContact = (contact?: Contact) => {
    closeSidebar()
    setEditedContact(undefined)
    openSidebar(contact as Contact)
  }

  const saveEditedContact = (contact: Contact) => {
    setEditedContact(contact)
    if (editContact) {
      editContact(contact.id, contact)
    }
    cancelEditingContact(contact)
    openSidebar(contact)
  }

  const openDeleteModal = (contact: Contact) => {
    const handleDelete = async () => {
      modalService.rerenderModal(
        <DeleteModal
          deleting
          title={intl.formatMessage({
            id: "view.name.phone.contacts.modal.delete.title",
          })}
          text={intl.formatMessage(
            {
              id: "view.name.phone.contacts.modal.delete.text",
            },
            { name: createFullName(contact), ...textFormatters }
          )}
        />
      )

      // await can be restored if we will process the result directly in here, not globally
      if (removeContact) {
        removeContact(contact.id)
      }
      await modalService.closeModal()
      cancelOrCloseContactHandler()
    }

    modalService.openModal(
      <DeleteModal
        onDelete={handleDelete}
        title={intl.formatMessage({
          id: "view.name.phone.contacts.modal.delete.title",
        })}
        text={intl.formatMessage(
          {
            id: "view.name.phone.contacts.modal.delete.text",
          },
          { name: createFullName(contact), ...textFormatters }
        )}
      />
    )
  }

  const handleUnblock = async (contact: Contact) => {
    const unblockedContact: Contact = {
      ...contact,
      blocked: false,
    }
    if (editContact) {
      await editContact(unblockedContact.id, unblockedContact)
    }
    if (detailsEnabled) {
      openSidebar(unblockedContact)
    }
  }

  const openBlockModal = (contact: Contact) => {
    const handleBlock = async () => {
      modalService.rerenderModal(
        <BlockContactModal contact={contact} blocking />
      )
      const blockedContact: Contact = {
        ...contact,
        blocked: true,
        favourite: false,
      }
      if (editContact) {
        await editContact(blockedContact.id, blockedContact)
      }
      await modalService.closeModal()

      if (detailsEnabled) {
        openSidebar(blockedContact)
      }
    }

    modalService.openModal(
      <BlockContactModal contact={contact} onBlock={handleBlock} />
    )
  }

  const closeSpeedDialModal = async () => {
    await modalService.closeModal()
  }

  const openSpeedDialModal = () => {
    modalService.openModal(
      <SpeedDialModal
        onClose={cancelEditingContact}
        onSave={closeSpeedDialModal}
      />
    )
  }

  const openSuccessSyncModal = async () => {
    // TODO: Replace it with correct modal for success state when its done by design
    await modalService.closeModal()
    await modalService.openModal(
      <Modal title={"Success"} size={ModalSize.Small} />
    )
  }

  const openFailureSyncModal = async () => {
    // TODO: Replace it with correct modal for failure state when its done by design
    await modalService.closeModal()
    await modalService.openModal(
      <Modal title={"Failure"} size={ModalSize.Small} />
    )
  }

  const openProgressSyncModal = async () => {
    await modalService.closeModal()
    await modalService.openModal(
      <SynchronizingContactsModal
        body={{
          id: "view.name.phone.contacts.synchronizingModalBody",
        }}
        subtitle={{
          id: "view.name.phone.contacts.synchronizingModalTitle",
        }}
        closeButtonLabel={intl.formatMessage({
          id: "view.generic.button.cancel",
        })}
        onFailure={openFailureSyncModal}
        onSuccess={openSuccessSyncModal}
        failed={sync % 3 === 0}
        icon={Type.SynchronizeContacts}
      />
    )
  }

  const openSyncModal = () => {
    setSync((value) => value + 1)
    modalService.openModal(
      <SyncContactsModal
        onAppleButtonClick={openProgressSyncModal}
        onGoogleButtonClick={openProgressSyncModal}
      />
    )
  }

  const _devClearContacts = () => setContacts([])
  const _devLoadDefaultContacts = () => setContacts(contactList)

  return (
    <>
      <DevModeWrapper>
        <p>Messages on list: {contacts.length}</p>
        <Button onClick={_devClearContacts} label="Remove all contacts" />
        <br />
        <Button
          onClick={_devLoadDefaultContacts}
          label="Load default contact list"
        />
      </DevModeWrapper>
      <ContactSection>
        <ContactPanel
          onSearchTermChange={onSearchTermChange}
          onManageButtonClick={openSyncModal}
          onNewButtonClick={handleAddingContact}
        />
        <TableWithSidebarWrapper>
          <ContactList
            activeRow={activeRow}
            contactList={contacts}
            onSelect={openSidebar}
            onExport={noop}
            onForward={noop}
            onUnblock={handleUnblock}
            onBlock={openBlockModal}
            onDelete={openDeleteModal}
            onCheck={noop}
            newContact={newContact}
            editedContact={editedContact}
            resultsState={ResultsState.Loaded}
          />
          {newContact && (
            <ContactEdit
              onCancel={cancelOrCloseContactHandler}
              onSpeedDialSettingsOpen={openSpeedDialModal}
              onSave={saveNewContact}
              onNameUpdate={handleNameUpdate}
              saving={savingContact}
            />
          )}
          {editedContact && (
            <ContactEdit
              contact={editedContact}
              onCancel={cancelEditingContact}
              onSpeedDialSettingsOpen={openSpeedDialModal}
              onSave={saveEditedContact}
              saving={savingContact}
            />
          )}
          {detailsEnabled && (
            <ContactDetails
              contact={contactFreshData(activeRow as Contact)}
              onClose={closeSidebar}
              onExport={noop}
              onForward={noop}
              onUnblock={handleUnblock}
              onBlock={openBlockModal}
              onDelete={openDeleteModal}
              onEdit={handleEditingContact}
              onCall={onCall}
              onMessage={onMessage}
            />
          )}
        </TableWithSidebarWrapper>
      </ContactSection>
    </>
  )
}

export default Phone

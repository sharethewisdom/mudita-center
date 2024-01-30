/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import { ContactSimpleListItemAvatarProps } from "Core/contacts/components/contact-simple-list-item-avatar/contact-simple-list-item-avatar.interface"
import {
  BlockedIcon,
  InitialsAvatar,
  NameSpan,
} from "Core/contacts/components/contact-simple-list-item-avatar/contact-simple-list-item-avatar.styled"
import { ContactSimpleListItemAvatarTestIds } from "Core/contacts/components/contact-simple-list-item-avatar/contact-simple-list-item-avatar-test-ids.enum"
import { createFullName } from "Core/contacts/helpers/contacts.helpers"
import { AvatarSize } from "Core/__deprecated__/renderer/components/core/avatar/avatar.component"
import { FunctionComponent } from "Core/core/types/function-component.interface"
import { intl } from "Core/__deprecated__/renderer/utils/intl"
import React from "react"
import { defineMessages } from "react-intl"

const messages = defineMessages({
  unnamedContact: { id: "module.contacts.listUnnamedContact" },
})

export const ContactSimpleListItemAvatar: FunctionComponent<
  ContactSimpleListItemAvatarProps
> = ({ contact }) => {
  const fullName = createFullName(contact)

  return (
    <>
      <InitialsAvatar user={contact} size={AvatarSize.Small} />
      <NameSpan>
        {fullName || intl.formatMessage(messages.unnamedContact)}
      </NameSpan>
      {contact.blocked && (
        <BlockedIcon
          width={2}
          height={2}
          data-testid={ContactSimpleListItemAvatarTestIds.Blocked}
        />
      )}
    </>
  )
}
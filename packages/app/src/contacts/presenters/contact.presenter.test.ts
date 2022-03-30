/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import { Contact as PureContact } from "@mudita/pure"
import { ContactPresenter } from "App/contacts/presenters/contact.presenter"

const pureContact: PureContact = {
  id: 19,
  address: "6 Czeczota St.\n02600 Warsaw",
  altName: "Boligłowa",
  blocked: false,
  favourite: true,
  numbers: ["500400300"],
  priName: "Alek",
}

const subject = new ContactPresenter()

describe("`ContactPresenter`", () => {
  test("`serializeRecord` serialize record properly", async () => {
    const contact = subject.serialize(pureContact)
    expect(contact).toEqual({
      blocked: false,
      email: "",
      favourite: true,
      firstAddressLine: "6 Czeczota St.",
      firstName: "Alek",
      ice: false,
      id: "19",
      lastName: "Boligłowa",
      note: "",
      primaryPhoneNumber: "500400300",
      secondAddressLine: "02600 Warsaw",
      secondaryPhoneNumber: "",
    })
  })
})

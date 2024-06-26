/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import React, { FunctionComponent } from "react"
import { ImportContactsError, Modal } from "generic-view/ui"
import { useDispatch, useSelector } from "react-redux"
import {
  cleanImportProcess,
  importStatusSelector,
  selectActiveDevice,
} from "generic-view/store"

const ImportContactsErrorModal: FunctionComponent = () => {
  const dispatch = useDispatch()
  const activeDevice = useSelector(selectActiveDevice)
  const importStatus = useSelector(importStatusSelector)
  const opened = importStatus === "FAILED" && !activeDevice

  const onClose = () => {
    dispatch(cleanImportProcess())
  }
  return (
    <Modal
      config={{ defaultOpened: opened, size: "small" }}
      componentKey={"import-contacts-error-modal"}
    >
      <ImportContactsError
        closeAction={{ type: "custom", callback: onClose }}
      />
    </Modal>
  )
}

export default ImportContactsErrorModal

/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import React from "react"
import { FunctionComponent } from "Core/core/types/function-component.interface"
import ContactSupportFlow from "Core/contact-support/containers/contact-support-flow.container"
import { UpdateOsInterruptedFlowContainer } from "Core/update/components/update-os-interrupted-flow"
import ErrorConnectingModal from "Core/connecting/components/error-connecting-modal"
import ConnectingLoaderModal from "Core/modals-manager/components/connecting-loader-modal.component"
import DetachedDuringUploadErrorModal
  from "Core/files-manager/components/dettached-during-upload-error-modal/dettached-during-upload-error-modal.component"

type Props = {
  contactSupportFlowShow: boolean
  deviceInitializationFailedModalShowEnabled: boolean
  hideModals: () => void
}

const ModalsManager: FunctionComponent<Props> = ({
  contactSupportFlowShow,
  deviceInitializationFailedModalShowEnabled,
  hideModals,
}) => {
  return (
    <>
      {deviceInitializationFailedModalShowEnabled && (
        <ErrorConnectingModal open closeModal={hideModals} />
      )}
      {contactSupportFlowShow && <ContactSupportFlow />}
      <UpdateOsInterruptedFlowContainer />
      <ConnectingLoaderModal />
      <DetachedDuringUploadErrorModal />
    </>
  )
}

export default ModalsManager

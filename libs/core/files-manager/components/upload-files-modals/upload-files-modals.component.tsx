/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import React from "react"
import { defineMessages } from "react-intl"
import { UploadFilesModalsTestIds } from "Core/files-manager/components/upload-files-modals/upload-files-modals-test-ids.enum"
import { UploadFilesModalProps } from "Core/files-manager/components/upload-files-modals/upload-files-modals.interface"
import { FilesManagerError } from "Core/files-manager/constants"
import ErrorModal from "Core/ui/components/error-modal/error-modal.component"
import InfoPopup from "Core/ui/components/info-popup/info-popup.component"
import LoaderModal from "Core/ui/components/loader-modal/loader-modal.component"
import { FunctionComponent } from "Core/core/types/function-component.interface"
import { intl, textFormatters } from "Core/__deprecated__/renderer/utils/intl"
import DuplicatedFilesModal from "Core/files-manager/components/duplicated-files-modal/duplicated-files-modal.component"
import UnsupportedFileFormatModal from "Core/files-manager/components/unsupported-file-format-modal/unsupported-file-format-modal.component"
import UnsupportedFileSizeModal from "Core/files-manager/components/unsupported-file-size-modal/unsupported-file-size-modal.component"
import { InvalidFilesModal } from "../invalid-files-modal/invalid-files-modal.component"

const messages = defineMessages({
  uploadingModalInfo: { id: "module.filesManager.uploadingModalInfo" },
  uploadingModalErrorTitle: {
    id: "module.filesManager.uploadingModalErrorTitle",
  },
  uploadingModalErrorSubtitle: {
    id: "module.filesManager.uploadingModalErrorSubtitle",
  },
  uploadingModalNoSpaceErrorTitle: {
    id: "module.filesManager.uploadingModalNoSpaceErrorTitle",
  },
  uploadingModalErrorNoSpaceSubtitle: {
    id: "module.filesManager.uploadingModalNoSpaceErrorSubtitle",
  },
  uploadingModalTitle: { id: "module.filesManager.uploadingModalTitle" },
  uploadingModalSubtitle: { id: "module.filesManager.uploadingModalSubtitle" },
  uploadingModalBody: { id: "module.filesManager.uploadingModalBody" },
})

export const UploadFilesModals: FunctionComponent<UploadFilesModalProps> = ({
  error,
  filesLength,
  uploading,
  uploadingInfo,
  onCloseUploadingErrorModal,
}) => {
  const errorTitle =
    error?.type === FilesManagerError.NotEnoughSpace
      ? messages.uploadingModalNoSpaceErrorTitle
      : messages.uploadingModalErrorTitle
  const errorSubtitle =
    error?.type === FilesManagerError.NotEnoughSpace
      ? messages.uploadingModalErrorNoSpaceSubtitle
      : messages.uploadingModalErrorSubtitle

  return (
    <>
      {uploading && (
        <LoaderModal
          testId={UploadFilesModalsTestIds.LoadingModal}
          open={uploading}
          title={intl.formatMessage(messages.uploadingModalTitle)}
          subtitle={intl.formatMessage(messages.uploadingModalSubtitle)}
          body={intl.formatMessage(messages.uploadingModalBody)}
        />
      )}
      {uploadingInfo && (
        <InfoPopup
          message={{
            ...messages.uploadingModalInfo,
            values: { ...textFormatters, num: filesLength },
          }}
          testId={UploadFilesModalsTestIds.UploadedPopUp}
        />
      )}
      {error &&
        error.type !== FilesManagerError.UploadDuplicates &&
        error.type !== FilesManagerError.UnsupportedFileFormat &&
        error.type !== FilesManagerError.UnsupportedFileSize && (
          <ErrorModal
            testId={UploadFilesModalsTestIds.ErrorModal}
            open
            title={intl.formatMessage(errorTitle)}
            subtitle={intl.formatMessage(errorSubtitle)}
            closeModal={onCloseUploadingErrorModal}
          />
        )}
      <DuplicatedFilesModal />
      <UnsupportedFileFormatModal />
      <UnsupportedFileSizeModal />
      <InvalidFilesModal />
    </>
  )
}

/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

export enum FileManagerServiceEvents {
  SaveFile = "apiservice_file_manager-save-file",
  SaveBackupFile = "apiservice_file_manager-save-backup-file",
  GetBackupPath = "apiservice_file_manager-get-backup-path",
  OpenBackupDirectory = "apiservice_file_manager-open-directory",
  ReadDirectory = "apiservice_file_manager-read-directory",
  ReadBackupDirectory = "apiservice_file_manager-read-backup-directory",
}

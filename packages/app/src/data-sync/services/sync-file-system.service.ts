/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import fs from "fs"
import CryptoFileService from "App/file-system/services/crypto-file-service/crypto-file-service"

export class SyncFileSystemService {
  constructor(private token: string) {}

  readFileSync(filePath: string): Buffer | undefined | null {
    try {
      const buffer = fs.readFileSync(filePath)
      return CryptoFileService.decryptViaToken({ buffer, token: this.token })
    } catch {
      return null
    }
  }
}

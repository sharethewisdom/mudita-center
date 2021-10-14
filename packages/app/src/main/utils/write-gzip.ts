/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import fs from "fs"
import archiver from "archiver"

export interface WriteGzipData {
  filePath: string
}

const writeGzip = ({ filePath }: WriteGzipData): Promise<boolean> => {
  return new Promise((resolve) => {
    const archive = archiver("zip", {
      zlib: { level: 9 },
    })

    const output = fs.createWriteStream(`${filePath}.zip`)

    output.on("close", function () {
      resolve(true)
    })

    archive.on("error", function () {
      resolve(false)
    })

    archive.pipe(output)

    archive.directory(`${filePath}/`, false)

    void archive.finalize()
  })
}

export default writeGzip
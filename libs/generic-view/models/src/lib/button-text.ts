/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import { z } from "zod"
import { IconType } from "generic-view/utils"
import { buttonActionValidator } from "./common-validators"

const dataValidator = z.undefined()

const configValidator = z.object({
  text: z.string(),
  icon: z.nativeEnum(IconType).optional(),
  action: buttonActionValidator,
  modifiers: z
    .array(z.enum(["link", "uppercase", "hover-underline"]))
    .optional(),
})

export type ButtonTextConfig = z.infer<typeof configValidator>

export const buttonText = {
  key: "button-text",
  dataValidator,
  configValidator,
} as const

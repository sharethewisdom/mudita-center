require("@testing-library/jest-dom/extend-expect")
require("jest-styled-components")
require("reflect-metadata")
const toBeTranslationKey = require("./src/jestMatchers/to-be-translation-key")

expect.extend({
  toBeTranslationKey,
})

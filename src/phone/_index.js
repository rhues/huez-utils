/** @module phone */

/**
 * @typedef {Object} PhoneNamespace
 * @property getAreaCode
 * @property formatNpa
 */

import { getAreaCode } from './areaCode.js'
import { formatNpa } from './formatNpa.js'

/** @type {PhoneNamespace} */
export const phone = {
  getAreaCode,
  formatNpa
}

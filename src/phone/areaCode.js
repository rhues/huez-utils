/** @module phone/getAreaCode */

import { areaCodes } from '../data/areaCodes.js'

/**
 * @typedef {Object} AreaCodeRecord
 * @property {string} code The area code
 * @property {string} location The area code location.
 * @property {string} country The country of the area code
 */

/**
 * @description gets information about a phone area code
 * @memberof phone
 * @param {string} value A 3-digit area code or a complete phone number meeting the NPA standard
 * @returns { AreaCodeRecord | undefined }
 */
function getAreaCode(value) {
  if (!value) {
    return
  }

  // strip out non-digit characters
  const digits = value.replace(/\D/g, '')

  if (digits.length === 3) {
    return areaCodes.find(a => a.code === digits)
  } else if (digits.length === 10) {
    return areaCodes.find(a => a.code === digits.substring(0, 3))
  } else if (digits.length === 11) {
    return areaCodes.find(a => a.code === digits.substring(1, 4))
  }
}

export { getAreaCode }
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
 * @param {string} code A 3-digit area code 
 * @returns { AreaCodeRecord }
 */
function getAreaCode(code) {
  return areaCodes.find(a => a.code === code)
}

export { getAreaCode }
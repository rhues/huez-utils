import { areaCodes } from '../data/areaCodes.js'

/** @module validation/phone */

/**
 * @description Validates a phone number.
 * @memberof validation
 * @param {string} [value] The phone number to validate.
 * @param {object} [options] optional options.
 * @param {boolean} [options.usOnly] True to validate with only US phone numbers.
 * @returns {import('../validation/_index.js').ValidationResult} The result of the phone number validation.
 */
export function phone(value, options = {}) {
  const result = { valid: false, errors: [] }
  
  // a blank value is considered valid - use other validations in addition to disallow blank values
  if (!value) {
    result.valid = true
    return result
  }

  // strip out non-digit characters
  const digits = value.replace(/\D/g, '')

  // validate length
  if (digits.length < 8 || digits.length > 15) {
    result.errors.push({ code: 'invalidPhoneLength', message: 'Invalid phone length' })
    return result
  }

  if (options.usOnly) {
    // validate US area codes
    if (digits.length === 10) {
      if (!areaCodes.filter(a => a.country === 'US').find(a => a.code === digits.substring(0, 3))) {
        result.errors.push({ code: 'invalidUsPhoneAreaCode', message: 'Invalid US phone area code' })
        return result
      }
    } else if (digits.length === 11) {
      // first digit must be 1
      if (digits.charAt(0) !== '1') {
          result.errors.push({ code: 'invalidUsPhoneCountryCode', message: 'Invalid US phone country code' })
          return result
      }
      // validate area code
      if (!areaCodes.filter(a => a.country === 'US').find(a => a.code === digits.substring(1, 4))) {
        result.errors.push({ code: 'invalidUsPhoneAreaCode', message: 'Invalid US phone area code' })
        return result
      }
    } else {
      result.errors.push({ code: 'invalidUsPhoneLength', message: 'Invalid US phone length' })
      return result
    }
  }

  result.valid = true
  return result
}
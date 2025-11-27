/** @module validation/domain */

import tldList from './tlds.js'

/**
 * @param {number} c A codepoint
 * @returns {boolean} True if the codepoint is an ASCII digit
 */
function isAsciiDigit(c) {
  return c >= 48 && c <= 57
}

/**
 * @param {number} c A codepoint
 * @returns {boolean} True if the codepoint is an ASCII uppercase letter
 */
function isAsciiUpperCase(c) {
  return c >= 65 && c <= 90
}

/**
 * @param {number} c A codepoint
 * @returns {boolean} True if the codepoint is an ASCII lowercase letter
 */
function isAsciiLowerCase(c) {
  return c >= 97 && c <= 122
}

/**
 * @param {number} codepoint A codepoint
 * @returns {boolean} True if the codepoint is a valid domain character
 */
function isValidDomainCharacter(codepoint) {
  if (!isAsciiLowerCase(codepoint)
      && !isAsciiUpperCase(codepoint)
      && !isAsciiDigit(codepoint)
      && !(codepoint === 45) // hyphen
      && !(codepoint >= 128)) { // above 7-bit ASCII
    return false
  }
  return true
}

/**
 * @description Validates a domain label.
 * @param {string} label The domain to validate.
 * @returns {import('../validation/_index.js').ValidationResult} The result of the domain validation.
 */
function isValidDomainLabel(label) {
  const result = { valid: false, errors: [] }

  // be sure each label is between 1 and 63 characters,
  // which also ensures there was not a double dot in the domain name
  // and that a domain did not start or end with a dot
  if (label.length < 1 || label.length > 63) {
    result.errors.push({ code: 'invalidDomainLabelLength', message: 'Invalid domain label length' })
    return result
  }

  // valid characters are ASCII letters and digits plus hyphen or codepoints equal to or above 128
  // Array.from is used to handle Unicode characters correctly
  const codePoints = Array.from(label, char => char.codePointAt(0))
  if (!codePoints.every(isValidDomainCharacter)) {
    result.errors.push({ code: 'invalidDomainCharacter', message: 'Invalid domain character' })
    return result
  }

  // label cannot start or end with hyphen
  if (label.startsWith('-') || label.endsWith('-')) {
    result.errors.push({ code: 'invalidDomainLabelHyphen', message: 'Invalid domain label hyphen' })
    return result
  }

  result.valid = true
  return result
}

/**
 * @description Validates a domain.
 * @memberof validation
 * @param {string} value The domain to validate.
 * @returns {import('../validation/_index.js').ValidationResult} The result of the domain validation.
 */
export function domain(value) {
  const result = { valid: false, errors: [] }
  
  // a blank value is considered valid - use other validations in addition to disallow blank values
  if (!value) {
    result.valid = true
    return result
  }

  // domain must be 253 characters or less - 3 or more
  if (value.length > 253 || value.length < 3) {
    result.errors.push({ code: 'invalidDomainLength', message: 'Invalid domain length' })
    return result
  }

  // domains are comprised of labels delimited by dot characters.
  const labels = value.split('.')

  // domain must have at least two "labels".
  // local domains are technically valid, but not allowed here.
  if (labels.length < 2) {
    result.errors.push({ code: 'invalidDomainLabelCount', message: 'Invalid domain label count' })
    return result
  }

  // check that every domain label is valid
  labels.forEach(label => {
    const test = isValidDomainLabel(label)
    if (test.errors.length > 0) {
      result.errors.push(...test.errors)
    }
  })
  if (result.errors.length > 0) {
    return result
  }

  // check top-level domain (TLD) against known list
  if (!tldList.has(labels[labels.length - 1].toUpperCase())) {
    result.errors.push({ code: 'invalidDomainTld', message: 'Invalid domain top-level domain' })
    return result
  }

  result.valid = true
  return result
}
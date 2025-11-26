/** @module validation/email */

import { domain } from './domain.js'

// pre-compiled set of blacklisted codepoints --> " ,:;<>[]()
const blacklistCharacters = new Set([ 34, 32, 44, 58, 59, 60, 62, 91, 93, 40, 41 ]);

/**
 * @param {number} codepoint 
 * @returns {boolean}
 */
function isValidLocalPartCharacter(codepoint) {
  return !blacklistCharacters.has(codepoint)
}

/**
 * @param {string} localPart The part of the email before the "@" symbol.
 * @returns {import('../validation/_index.js').ValidationResult} The result of the email local part validation.
 */
function isValidLocalPart(localPart) {
  const result = { valid: false, errors: [] }

  // local part must be 64 characters or less and at least one character
  if (localPart.length > 64 || localPart.length < 1) {
    result.errors.push({ code: 'invalidEmailLocalPartLength', message: 'Invalid email local part length' })
    return result
  }

  // dot issues
  if (localPart.startsWith('.') || localPart.includes('..')) {
    result.errors.push({ code: 'invalidEmailDot', message: 'Invalid email dot' })
    return result
  }

  // local part must not be the special value postmaster
  if (localPart.toLowerCase() === 'postmaster') {
    result.errors.push({ code: 'invalidEmailNoPostmaster', message: 'Invalid email no postmaster' })
    return result
  }

  // don't allow quoted strings and filter some bad or unusual characters
  // this is more strict than RFC 3696, which allows quoted strings
  const codepoints = Array.from(localPart, char => char.codePointAt(0))
  if (!codepoints.every(isValidLocalPartCharacter)) {
    result.errors.push({ code: 'invalidEmailCharacter', message: 'Invalid email charactrer' })
    return result
  }

  result.valid = true
  return result
}

/**
 * @description Validates an email address.
 * @memberof validation
 * @param {string} value The email address to validate.
 * @returns {import('../validation/_index.js').ValidationResult} The result of the email validation.
 */
export function email(value) {
  const result = { valid: false, errors: [] }

  // a blank value is considered valid - use other validations in addition to disallow blank values
  if (!value) {
    result.valid = true
    return result
  }

  // split on the @ symbol
  const split = value.split('@')

  // must have exactly two parts
  if (split.length !== 2) {
    result.errors.push({ code: 'invalidEmailFormat', message: 'Invalid email format' })
    return result
  }

  // domain
  const domainTest = domain(split[1])
  if (!domainTest.valid) {
    result.errors.push(...domainTest.errors)
    return result
  }
  
  // local part
  const localPartTest = isValidLocalPart(split[0])
  if (!localPartTest.valid) {
    result.errors.push(...localPartTest.errors)
    return result
  }

  result.valid = true
  return result
}